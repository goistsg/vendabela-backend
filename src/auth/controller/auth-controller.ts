import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Autenticação')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ====== AUTENTICAÇÃO ======

  @Post('login')
  @ApiOperation({
    summary: 'Login com email e senha',
    description: 'Autentica usuário e retorna JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            whatsapp: { type: 'string' },
            plan: { type: 'object' },
            companies: { type: 'array' },
          },
        },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        message: { type: 'string', example: 'Login realizado com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Logout',
    description: 'Invalida o token do usuário (se houver implementação de blacklist)',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout realizado com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@CurrentUser() user: any) {
    // TODO: Implementar blacklist de tokens se necessário
    return {
      message: 'Logout realizado com sucesso',
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description: 'Retorna informações do usuário logado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            whatsapp: { type: 'string' },
            emailVerified: { type: 'boolean' },
            plan: { type: 'object' },
            companies: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getProfile(@CurrentUser() user: any) {
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
    };
  }

  // ====== RECUPERAÇÃO DE SENHA ======

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Esqueceu a senha',
    description: 'Envia email com link para resetar senha',
  })
  @ApiResponse({
    status: 200,
    description: 'Instruções enviadas',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha',
        },
        resetToken: {
          type: 'string',
          example: 'abc123token456xyz (apenas em desenvolvimento)',
        },
      },
    },
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetar senha',
    description: 'Redefine senha usando token recebido por email',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha redefinida com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ====== REFRESH TOKEN (OPCIONAL) ======

  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar token JWT',
    description: 'Gera novo token usando refresh token (não implementado ainda)',
  })
  @ApiResponse({ status: 200, description: 'Token renovado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
