import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Autenticação')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar login com WhatsApp', description: 'Envia OTP via WhatsApp para autenticação' })
  @ApiResponse({ status: 200, description: 'OTP enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verificar OTP', description: 'Valida o código OTP e retorna token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', schema: {
    type: 'object',
    properties: {
      user: { type: 'object' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      message: { type: 'string', example: 'Login realizado com sucesso' }
    }
  }})
  @ApiResponse({ status: 401, description: 'OTP inválido ou expirado' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter perfil do usuário', description: 'Retorna informações do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', schema: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          whatsapp: { type: 'string' },
          plan: { type: 'object' },
          companies: { type: 'array' }
        }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getProfile(@CurrentUser() user: any) {
    return {
      user: {
        id: user.id,
        name: user.name,
        whatsapp: user.whatsapp,
        plan: user.plan,
        companies: user.companies
      }
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout', description: 'Realiza logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso', schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Logout realizado com sucesso' }
    }
  }})
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@CurrentUser() user: any) {
    // Em produção, invalidar token no banco de dados
    return {
      message: 'Logout realizado com sucesso'
    };
  }
}
