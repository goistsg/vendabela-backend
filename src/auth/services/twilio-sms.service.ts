import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioSmsService {
  private readonly logger = new Logger(TwilioSmsService.name);
  private twilioClient: twilio.Twilio;
  private readonly fromPhone: string;
  private readonly verifyServiceSid: string;
  private readonly useVerifyApi: boolean;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromPhone = process.env.TWILIO_PHONE_NUMBER || '';
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || '';
    this.useVerifyApi = !!this.verifyServiceSid;

    if (!accountSid || !authToken) {
      this.logger.warn(
        'Twilio credentials not configured. SMS sending will be disabled.'
      );
      return;
    }

    this.twilioClient = new twilio.Twilio(accountSid, authToken);
    
    if (this.useVerifyApi) {
      this.logger.log('Twilio SMS Service initialized with Verify API');
    } else {
      this.logger.log('Twilio SMS Service initialized with traditional SMS');
      this.logger.warn('Consider using Twilio Verify API for better OTP management');
    }
  }

  /**
   * Envia um SMS com OTP para o número especificado
   * @param phoneNumber Número de telefone no formato internacional (ex: +5511999999999)
   * @param otpCode Código OTP de 6 dígitos (opcional se usar Verify API)
   * @returns Promise com resultado do envio
   */
  async sendOtpSms(phoneNumber: string, otpCode?: string): Promise<boolean> {
    // Validar se Twilio está configurado
    if (!this.twilioClient) {
      this.logger.warn(
        `Twilio not configured. OTP ${otpCode || 'AUTO'} for ${phoneNumber} would be sent in production.`
      );
      
      // Em desenvolvimento, logar o OTP
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`[DEV] OTP para ${phoneNumber}: ${otpCode || 'GERADO_AUTOMATICAMENTE'}`);
      }
      
      return false;
    }

    try {
      // Formatar número de telefone para o padrão internacional
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Se Verify API estiver configurado, usar ela
      if (this.useVerifyApi) {
        return await this.sendOtpViaVerify(formattedPhone);
      }

      // Fallback: SMS tradicional (requer otpCode)
      if (!otpCode) {
        throw new Error('OTP code is required when Verify API is not configured');
      }

      // Criar mensagem do SMS
      const message = this.createOtpMessage(otpCode);

      // Enviar SMS via Twilio
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.fromPhone,
        to: formattedPhone,
      });

      this.logger.log(
        `SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`
      );

      return result.status === 'queued' || result.status === 'sent';
    } catch (error: any) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber}: ${error.message}`,
        error.stack
      );
      
      // Em desenvolvimento, não falhar - apenas logar
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`[DEV] OTP que seria enviado para ${phoneNumber}: ${otpCode || 'AUTO'}`);
        return true; // Simular sucesso em dev
      }
      
      return false;
    }
  }

  /**
   * Envia OTP usando Twilio Verify API
   * A Verify API gera e gerencia o código automaticamente
   */
  private async sendOtpViaVerify(phoneNumber: string): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications
        .create({ 
          to: phoneNumber, 
          channel: 'sms',
          locale: 'pt-BR' // Mensagens em português
        });

      this.logger.log(
        `Verify OTP sent to ${phoneNumber}. Status: ${verification.status}`
      );

      return verification.status === 'pending';
    } catch (error: any) {
      this.logger.error(
        `Failed to send Verify OTP to ${phoneNumber}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Verifica o código OTP usando Twilio Verify API
   * @param phoneNumber Número de telefone no formato internacional
   * @param code Código OTP fornecido pelo usuário
   * @returns Promise<boolean> true se o código for válido
   */
  async verifyOtpCode(phoneNumber: string, code: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured. OTP verification skipped.');
      
      // Em desenvolvimento, aceitar qualquer código de 6 dígitos
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`[DEV] OTP verification bypassed for ${phoneNumber}`);
        return code.length === 6;
      }
      
      return false;
    }

    // Se não estiver usando Verify API, retornar false (verificação será feita no banco)
    if (!this.useVerifyApi) {
      this.logger.debug('Verify API not configured. Use database OTP verification.');
      return false;
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const verificationCheck = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks
        .create({ 
          to: formattedPhone, 
          code 
        });

      this.logger.log(
        `OTP verification for ${formattedPhone}: ${verificationCheck.status}`
      );

      return verificationCheck.status === 'approved';
    } catch (error: any) {
      this.logger.error(
        `Failed to verify OTP for ${phoneNumber}: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Formata o número de telefone para o padrão internacional
   * Assume que números sem + são brasileiros (+55)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remover caracteres não numéricos
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Se não começar com código do país, assumir Brasil (+55)
    if (!phoneNumber.startsWith('+')) {
      // Se tiver 11 dígitos (DDD + 9 dígitos), adicionar +55
      if (cleaned.length === 11) {
        cleaned = `+55${cleaned}`;
      }
      // Se tiver 13 dígitos (55 + DDD + 9 dígitos), adicionar +
      else if (cleaned.length === 13 && cleaned.startsWith('55')) {
        cleaned = `+${cleaned}`;
      }
      // Caso contrário, adicionar +
      else {
        cleaned = `+${cleaned}`;
      }
    } else {
      cleaned = phoneNumber;
    }

    return cleaned;
  }

  /**
   * Cria a mensagem do SMS com o OTP
   */
  private createOtpMessage(otpCode: string): string {
    return `Seu código de verificação para login é: ${otpCode}\n\nEste código expira em 10 minutos.\n\nNão compartilhe este código com ninguém.`;
  }

  /**
   * Verifica se o serviço Twilio está configurado e disponível
   */
  isConfigured(): boolean {
    return !!this.twilioClient;
  }

  /**
   * Verifica se está usando Twilio Verify API
   */
  isUsingVerifyApi(): boolean {
    return this.useVerifyApi;
  }

  /**
   * Envia um SMS genérico
   * @param phoneNumber Número de telefone
   * @param message Mensagem a ser enviada
   */
  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured. SMS not sent.');
      return false;
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.fromPhone,
        to: formattedPhone,
      });

      this.logger.log(
        `SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`
      );

      return result.status === 'queued' || result.status === 'sent';
    } catch (error: any) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber}: ${error.message}`,
        error.stack
      );
      return false;
    }
  }
}

