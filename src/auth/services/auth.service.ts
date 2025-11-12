import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { TwilioSmsService } from './twilio-sms.service';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private twilioSmsService: TwilioSmsService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ 
      where: { whatsapp: dto.whatsapp },
      include: {
        plan: true,
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar OTP de 6 dígitos
    const otpCode = this.generateOTP();
    
    // Salvar OTP no usuário
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode }
    });

    // Enviar OTP via SMS usando Twilio
    const smsSent = await this.twilioSmsService.sendOtpSms(user.whatsapp, otpCode);

    if (!smsSent && process.env.NODE_ENV === 'production') {
      // Em produção, se o SMS falhar, ainda permitir (mas logar o erro)
      console.error(`Falha ao enviar SMS para ${user.whatsapp}`);
    }

    return {
      message: 'OTP enviado com sucesso',
      whatsapp: user.whatsapp,
      smsSent: smsSent,
      // Em desenvolvimento, retornar o OTP para facilitar testes
      otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        whatsapp: dto.whatsapp, 
        otpCode: dto.otpCode 
      },
      include: {
        plan: true,
        companies: {
          include: {
            company: true,
            segment: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('OTP inválido ou expirado');
    }

    // Limpar OTP após verificação bem-sucedida
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null }
    });

    // Gerar token JWT
    const token = this.generateJwtToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        whatsapp: user.whatsapp,
        plan: user.plan,
        companies: user.companies
      },
      token,
      message: 'Login realizado com sucesso'
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateJwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

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
              segment: true
            }
          }
        }
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido');
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
}