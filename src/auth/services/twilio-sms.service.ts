import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioSmsService {
  private readonly logger = new Logger(TwilioSmsService.name);
  private twilioClient: twilio.Twilio;
  private readonly fromPhone: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromPhone = process.env.TWILIO_PHONE_NUMBER || '';

    if (!accountSid || !authToken) {
      this.logger.warn(
        'Twilio credentials not configured. SMS sending will be disabled.'
      );
      return;
    }

    this.twilioClient = new twilio.Twilio(accountSid, authToken);
    this.logger.log('Twilio SMS Service initialized successfully');
  }

  /**
   * Envia um SMS com OTP para o número especificado
   * @param phoneNumber Número de telefone no formato internacional (ex: +5511999999999)
   * @param otpCode Código OTP de 6 dígitos
   * @returns Promise com resultado do envio
   */
  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<boolean> {
    // Validar se Twilio está configurado
    if (!this.twilioClient) {
      this.logger.warn(
        `Twilio not configured. OTP ${otpCode} for ${phoneNumber} would be sent in production.`
      );
      
      // Em desenvolvimento, logar o OTP
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`[DEV] OTP para ${phoneNumber}: ${otpCode}`);
      }
      
      return false;
    }

    try {
      // Formatar número de telefone para o padrão internacional
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

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
        this.logger.debug(`[DEV] OTP que seria enviado para ${phoneNumber}: ${otpCode}`);
        return true; // Simular sucesso em dev
      }
      
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

