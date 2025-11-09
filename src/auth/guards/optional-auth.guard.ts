import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

/**
 * Guard opcional que tenta autenticar o usuário, mas não bloqueia se não houver token
 * Útil para rotas públicas que podem ter funcionalidades extras para usuários autenticados
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Se não houver token, permite a requisição continuar sem autenticação
    if (!token) {
      return true;
    }

    try {
      // Se houver token, tenta validar e adiciona o usuário à requisição
      const user = await this.authService.validateToken(token);
      request.user = user;
      return true;
    } catch (error) {
      // Se o token for inválido, permite continuar sem autenticação
      // (não bloqueia a requisição, apenas não adiciona o usuário)
      return true;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

