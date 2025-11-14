import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Primeiro, autentica o usuário (extrai e valida o token JWT)
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const user = await this.authService.validateToken(token);
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // 2. Depois, verifica se o usuário é admin
    if (!request.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (request.user.plan?.name !== 'ADMIN') {
      throw new ForbiddenException('Acesso negado. Apenas administradores podem realizar esta ação.');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
