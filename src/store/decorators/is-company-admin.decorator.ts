import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractCompanyId, isCompanyAdmin } from './decorator-helpers';

/**
 * Decorator que retorna TRUE se o usuário é COMPANY_ADMIN
 * na empresa atual, FALSE caso contrário
 * 
 * Versão com helper functions - mais limpo e testável
 * 
 * @example
 * async findOne(@IsCompanyAdmin() isAdmin: boolean) {
 *   if (isAdmin) {
 *     return this.service.findAll();
 *   }
 *   return this.service.findByUserId(userId);
 * }
 */
export const IsCompanyAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const companyId = extractCompanyId(ctx);

    if (!user || !companyId) {
      return false;
    }

    return isCompanyAdmin(user, companyId);
  },
);

