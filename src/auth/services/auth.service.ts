import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../shared/services/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // ====== AUTENTICAÇÃO ======

  async login(dto: LoginDto) {
    // Buscar usuário por email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        plan: true,
        companies: {
          include: {
            company: true,
            segment: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    if (!user.password) {
      throw new UnauthorizedException('Usuário sem senha cadastrada. Entre em contato com o suporte.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo. Entre em contato com o suporte.');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Atualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Gerar token JWT
    const token = this.generateJwtToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        emailVerified: user.emailVerified,
        plan: user.plan,
        companies: user.companies,
      },
      token,
      message: 'Login realizado com sucesso',
    };
  }

  // ====== RECUPERAÇÃO DE SENHA ======

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Por segurança, não informar se o email existe ou não
      return {
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha',
      };
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      },
    });

    // Enviar email com link de reset
    try {
      const emailSent = await this.emailService.sendResetPasswordEmail(
        user.email,
        resetToken,
        user.name,
      );

      if (emailSent) {
        this.logger.log(`Password reset email sent successfully to ${user.email}`);
      } else {
        this.logger.warn(`Failed to send password reset email to ${user.email} (email service may not be configured)`);
      }
    } catch (error) {
      this.logger.error(`Error sending password reset email to ${user.email}:`, error);
    }

    // Em desenvolvimento, retornar o token para facilitar testes
    if (process.env.NODE_ENV === 'development') {
      return {
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha',
        resetToken, // Apenas em dev
      };
    }

    return {
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: dto.token,
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Atualizar senha e limpar token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        passwordChangedAt: new Date(),
      },
    });

    return {
      message: 'Senha redefinida com sucesso',
    };
  }

  // ====== REFRESH TOKEN (Opcional) ======

  async refreshToken(refreshToken: string) {
    // TODO: Implementar lógica de refresh token com blacklist/whitelist
    throw new Error('Not implemented yet');
  }

  // ====== VALIDAÇÃO DE TOKEN ======

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          plan: true,
          companies: {
            include: {
              company: true,
              segment: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Usuário inativo');
      }

      return user;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado, faça login novamente');
      }
      if (error?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }

  // ====== HELPERS PRIVADOS ======

  private generateJwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
