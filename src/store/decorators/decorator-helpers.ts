import { ExecutionContext } from '@nestjs/common';

/**
 * Helper function para extrair o companyId do request
 * Pode ser usado em múltiplos decorators
 */
export function extractCompanyId(ctx: ExecutionContext): string | null {
  const request = ctx.switchToHttp().getRequest();
  
  return (
    request.headers['company-id'] || 
    request.headers['x-company-id'] || 
    request.query?.companyId || 
    request.body?.companyId ||
    null
  );
}

/**
 * Helper function para verificar se usuário tem um role específico na empresa
 */
export function hasRoleInCompany(
  user: any, 
  companyId: string, 
  role: string,
): boolean {
  if (!user?.companies || !companyId) {
    return false;
  }

  return user.companies.some(
    (company) => 
      company.companyId === companyId && 
      company.role === role,
  );
}

/**
 * Helper function para verificar se usuário é admin na empresa
 */
export function isCompanyAdmin(user: any, companyId: string): boolean {
  return hasRoleInCompany(user, companyId, 'COMPANY_ADMIN');
}

