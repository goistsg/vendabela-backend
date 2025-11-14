import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../../prisma/prisma.service';

interface EmailConfig {
  from: string;
  fromName: string;
  replyTo?: string;
  appUrl: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private readonly defaultFromEmail: string;
  private readonly defaultFromName: string;
  private readonly defaultAppUrl: string;
  private readonly isConfigured: boolean;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.RESEND_API_KEY;
    this.defaultFromEmail = process.env.EMAIL_FROM || 'noreply@vendabela.com.br';
    this.defaultFromName = process.env.EMAIL_FROM_NAME || 'Vendabela';
    this.defaultAppUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured. Email sending will be disabled.');
      this.isConfigured = false;
      return;
    }

    this.resend = new Resend(apiKey);
    this.isConfigured = true;
    this.logger.log('Email Service initialized successfully with Resend');
  }

  /**
   * Busca configurações de email da empresa ou usa defaults
   */
  private async getEmailConfig(companyId?: string): Promise<EmailConfig> {
    // Se não tem companyId, usar defaults
    if (!companyId) {
      return {
        from: this.defaultFromEmail,
        fromName: this.defaultFromName,
        appUrl: this.defaultAppUrl,
      };
    }

    // Buscar configurações da empresa
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        emailFrom: true,
        emailFromName: true,
        emailReplyTo: true,
        appUrl: true,
        name: true,
      },
    });

    if (!company) {
      this.logger.warn(`Company ${companyId} not found, using default email config`);
      return {
        from: this.defaultFromEmail,
        fromName: this.defaultFromName,
        appUrl: this.defaultAppUrl,
      };
    }

    // Usar configurações da empresa ou fallback para defaults
    return {
      from: company.emailFrom || this.defaultFromEmail,
      fromName: company.emailFromName || company.name || this.defaultFromName,
      replyTo: company.emailReplyTo,
      appUrl: company.appUrl || this.defaultAppUrl,
    };
  }

  /**
   * Envia email de recuperação de senha
   */
  async sendResetPasswordEmail(
    to: string,
    resetToken: string,
    userName?: string,
    companyId?: string,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Reset password email would be sent to ${to} with token: ${resetToken}`);
      return false;
    }

    try {
      const config = await this.getEmailConfig(companyId);
      const resetLink = `${config.appUrl}/reset-password?token=${resetToken}`;

      const emailPayload: any = {
        from: `${config.fromName} <${config.from}>`,
        to: [to],
        subject: `🔐 Redefinir sua senha - ${config.fromName}`,
        html: this.getResetPasswordTemplate(resetLink, userName, config.fromName),
      };

      // Adicionar replyTo se configurado
      if (config.replyTo) {
        emailPayload.reply_to = config.replyTo;
      }

      const { data, error } = await this.resend.emails.send(emailPayload);

      if (error) {
        this.logger.error(`Failed to send reset password email to ${to}:`, error);
        return false;
      }

      this.logger.log(`Reset password email sent successfully to ${to}. ID: ${data?.id}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending reset password email to ${to}:`, error.message);
      return false;
    }
  }

  /**
   * Envia email de boas-vindas
   */
  async sendWelcomeEmail(
    to: string,
    userName: string,
    companyId?: string,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Welcome email would be sent to ${to}`);
      return false;
    }

    try {
      const config = await this.getEmailConfig(companyId);

      const emailPayload: any = {
        from: `${config.fromName} <${config.from}>`,
        to: [to],
        subject: `🎉 Bem-vindo ao ${config.fromName}!`,
        html: this.getWelcomeTemplate(userName, config.fromName, config.appUrl),
      };

      if (config.replyTo) {
        emailPayload.reply_to = config.replyTo;
      }

      const { data, error } = await this.resend.emails.send(emailPayload);

      if (error) {
        this.logger.error(`Failed to send welcome email to ${to}:`, error);
        return false;
      }

      this.logger.log(`Welcome email sent successfully to ${to}. ID: ${data?.id}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending welcome email to ${to}:`, error.message);
      return false;
    }
  }

  /**
   * Envia email de verificação de conta
   */
  async sendVerificationEmail(
    to: string,
    verificationToken: string,
    userName?: string,
    companyId?: string,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Verification email would be sent to ${to} with token: ${verificationToken}`);
      return false;
    }

    try {
      const config = await this.getEmailConfig(companyId);
      const verificationLink = `${config.appUrl}/verify-email?token=${verificationToken}`;

      const emailPayload: any = {
        from: `${config.fromName} <${config.from}>`,
        to: [to],
        subject: `✉️ Verificar seu email - ${config.fromName}`,
        html: this.getVerificationTemplate(verificationLink, userName, config.fromName),
      };

      if (config.replyTo) {
        emailPayload.reply_to = config.replyTo;
      }

      const { data, error } = await this.resend.emails.send(emailPayload);

      if (error) {
        this.logger.error(`Failed to send verification email to ${to}:`, error);
        return false;
      }

      this.logger.log(`Verification email sent successfully to ${to}. ID: ${data?.id}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending verification email to ${to}:`, error.message);
      return false;
    }
  }

  /**
   * Envia email genérico
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
    options?: {
      from?: string;
      replyTo?: string;
      companyId?: string;
    },
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Generic email would be sent to ${to}: ${subject}`);
      return false;
    }

    try {
      const config = await this.getEmailConfig(options?.companyId);
      const recipients = Array.isArray(to) ? to : [to];

      // Se from foi especificado, usar ele; caso contrário usar config da empresa
      const fromAddress = options?.from || `${config.fromName} <${config.from}>`;

      const emailPayload: any = {
        from: fromAddress,
        to: recipients,
        subject,
        html,
      };

      // Adicionar replyTo se fornecido ou se configurado na empresa
      if (options?.replyTo || config.replyTo) {
        emailPayload.reply_to = options?.replyTo || config.replyTo;
      }

      const { data, error } = await this.resend.emails.send(emailPayload);

      if (error) {
        this.logger.error(`Failed to send email to ${recipients.join(', ')}:`, error);
        return false;
      }

      this.logger.log(`Email sent successfully to ${recipients.join(', ')}. ID: ${data?.id}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending email:`, error.message);
      return false;
    }
  }

  /**
   * Verifica se o serviço está configurado
   */
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  // ====== TEMPLATES HTML ======

  private getResetPasswordTemplate(resetLink: string, userName?: string, brandName?: string): string {
    const brand = brandName || this.defaultFromName;
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir Senha</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8E9E0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8E9E0; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B2515E 0%, #BFA06A 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Redefinir Senha</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${userName ? `Olá, <strong>${userName}</strong>!` : 'Olá!'}
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Recebemos uma solicitação para redefinir a senha da sua conta ${brand}.
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="${resetLink}" 
                       style="background: linear-gradient(135deg, #BFA06A 0%, #B2515E 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              padding: 16px 40px; 
                              border-radius: 6px; 
                              font-size: 16px; 
                              font-weight: 600;
                              display: inline-block;">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
                Ou copie e cole este link no seu navegador:
              </p>
              
              <p style="color: #B2515E; font-size: 13px; word-break: break-all; background-color: #F8E9E0; padding: 12px; border-radius: 4px; margin: 0 0 30px;">
                ${resetLink}
              </p>
              
              <div style="border-top: 2px solid #BFA06A; padding-top: 20px;">
                <p style="color: #2B2B2B; font-size: 13px; line-height: 1.6; margin: 0;">
                  ⏰ <strong>Este link expira em 1 hora.</strong>
                </p>
                <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 10px 0 0;">
                  🔒 Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá segura.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8E9E0; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #2B2B2B; font-size: 12px; margin: 0 0 10px;">
                © ${new Date().getFullYear()} ${brand}. Todos os direitos reservados.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 0;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getWelcomeTemplate(userName: string, brandName?: string, appUrl?: string): string {
    const brand = brandName || this.defaultFromName;
    const url = appUrl || this.defaultAppUrl;
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8E9E0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8E9E0; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B2515E 0%, #BFA06A 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎉 Bem-vindo!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #2B2B2B; font-size: 18px; line-height: 1.6; margin: 0 0 20px;">
                Olá, <strong>${userName}</strong>!
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                É um prazer ter você conosco! Sua conta foi criada com sucesso na <strong>${brand}</strong>.
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Agora você pode aproveitar todas as funcionalidades da nossa plataforma para gerenciar suas vendas e produtos.
              </p>
              
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #F8E9E0; border-radius: 6px; border-left: 3px solid #BFA06A; margin-bottom: 10px;">
                    <p style="color: #2B2B2B; font-size: 15px; margin: 0;">
                      📦 <strong>Gerenciar Produtos</strong> - Adicione e organize seu catálogo
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #F8E9E0; border-radius: 6px; border-left: 3px solid #BFA06A;">
                    <p style="color: #2B2B2B; font-size: 15px; margin: 0;">
                      👥 <strong>Gerenciar Clientes</strong> - Mantenha contato com seus clientes
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #F8E9E0; border-radius: 6px; border-left: 3px solid #BFA06A;">
                    <p style="color: #2B2B2B; font-size: 15px; margin: 0;">
                      💰 <strong>Realizar Vendas</strong> - Controle seus pedidos e pagamentos
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 20px;">
                    <a href="${url}" 
                       style="background: linear-gradient(135deg, #BFA06A 0%, #B2515E 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              padding: 16px 40px; 
                              border-radius: 6px; 
                              font-size: 16px; 
                              font-weight: 600;
                              display: inline-block;">
                      Acessar Minha Conta
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                Se tiver alguma dúvida, estamos aqui para ajudar!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8E9E0; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #2B2B2B; font-size: 12px; margin: 0 0 10px;">
                © ${new Date().getFullYear()} ${brand}. Todos os direitos reservados.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 0;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getVerificationTemplate(verificationLink: string, userName?: string, brandName?: string): string {
    const brand = brandName || this.defaultFromName;
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificar Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8E9E0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8E9E0; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B2515E 0%, #BFA06A 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✉️ Verificar Email</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${userName ? `Olá, <strong>${userName}</strong>!` : 'Olá!'}
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Para completar seu cadastro e garantir a segurança da sua conta, precisamos verificar seu endereço de email.
              </p>
              
              <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Clique no botão abaixo para verificar seu email:
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="${verificationLink}" 
                       style="background: linear-gradient(135deg, #BFA06A 0%, #B2515E 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              padding: 16px 40px; 
                              border-radius: 6px; 
                              font-size: 16px; 
                              font-weight: 600;
                              display: inline-block;">
                      Verificar Meu Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
                Ou copie e cole este link no seu navegador:
              </p>
              
              <p style="color: #B2515E; font-size: 13px; word-break: break-all; background-color: #F8E9E0; padding: 12px; border-radius: 4px; margin: 0 0 30px;">
                ${verificationLink}
              </p>
              
              <div style="border-top: 2px solid #BFA06A; padding-top: 20px;">
                <p style="color: #2B2B2B; font-size: 13px; line-height: 1.6; margin: 0;">
                  🔒 Se você não criou uma conta conosco, ignore este email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8E9E0; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #2B2B2B; font-size: 12px; margin: 0 0 10px;">
                © ${new Date().getFullYear()} ${brand}. Todos os direitos reservados.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 0;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}

