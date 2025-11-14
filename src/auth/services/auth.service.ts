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

    // Verificar se está usando Twilio Verify API
    const usingVerifyApi = this.twilioSmsService.isUsingVerifyApi();
    
    let otpCode: string | undefined;

    if (usingVerifyApi) {
      // Twilio Verify API gera e gerencia o OTP automaticamente
      // Não precisa salvar no banco
      await this.twilioSmsService.sendOtpSms(user.whatsapp);
    } else {
      // Método tradicional: gerar OTP e salvar no banco
      otpCode = this.generateOTP();
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpCode }
      });

      await this.twilioSmsService.sendOtpSms(user.whatsapp, otpCode);
    }

    return {
      message: usingVerifyApi 
        ? 'Código de verificação enviado via SMS' 
        : 'OTP enviado com sucesso',
      whatsapp: user.whatsapp,
      usingVerifyApi,
      // Em desenvolvimento, retornar o OTP para facilitar testes (só no modo tradicional)
      otpCode: process.env.NODE_ENV === 'development' && !usingVerifyApi ? otpCode : undefined
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // Verificar se está usando Twilio Verify API
    const usingVerifyApi = this.twilioSmsService.isUsingVerifyApi();
    
    let user;

    if (usingVerifyApi) {
      // Verificar OTP através da Twilio Verify API
      const isValidOtp = await this.twilioSmsService.verifyOtpCode(
        dto.whatsapp,
        dto.otpCode
      );

      if (!isValidOtp) {
        throw new UnauthorizedException('Código inválido ou expirado');
      }

      // Buscar usuário após validação bem-sucedida
      user = await this.prisma.user.findUnique({
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
    } else {
      // Método tradicional: verificar OTP no banco de dados
      user = await this.prisma.user.findFirst({ 
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
    }

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