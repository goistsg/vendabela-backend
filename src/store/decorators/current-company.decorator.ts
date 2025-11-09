import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Tenta pegar do header primeiro
    let companyId = request.headers['company-id'];
    
    // Se não estiver no header, tenta pegar do query parameter
    if (!companyId) {
      companyId = request.query?.companyId;
    }
    
    // Se ainda não tiver, tenta pegar do body (para POST/PUT)
    if (!companyId) {
      companyId = request.body?.companyId;
    }
    
    if (!companyId) {
      throw new BadRequestException('ID da empresa (company-id header ou companyId query) é obrigatório');
    }
    
    return companyId;
  },
);
