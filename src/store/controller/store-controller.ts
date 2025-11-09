import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StoreService } from '../services/store-service';
import { CurrentCompany } from '../decorators/current-company.decorator';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { Request } from 'express';

@ApiTags('Loja')
@Controller('v1/store')
@UseGuards(OptionalAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('products')
  @ApiOperation({
    summary: 'Listar produtos da loja',
    description: 'Retorna produtos da empresa com filtros, busca e paginação',
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoria', type: String })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome, SKU ou descrição', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 20, máximo: 100)', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de produtos com paginação' })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findAllByCompany(
    @CurrentCompany() companyId: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() request?: Request,
  ) {
    const userId = (request as any)?.user?.id;
    return this.storeService.findAllByCompany(companyId, {
      category,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      userId,
    });
  }

  @Get('products/:id')
  @ApiOperation({
    summary: 'Buscar produto por ID',
    description: 'Retorna detalhes completos de um produto específico',
  })
  @ApiParam({ name: 'id', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(
    @Param('id') productId: string,
    @CurrentCompany() companyId: string,
    @Req() request?: Request,
  ) {
    const userId = (request as any)?.user?.id;
    return this.storeService.findOne(productId, companyId, userId);
  }

  @Get('products/:id/related')
  @ApiOperation({
    summary: 'Listar produtos relacionados',
    description: 'Retorna produtos relacionados baseado nas recomendações',
  })
  @ApiParam({ name: 'id', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Lista de produtos relacionados' })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findRelatedProducts(
    @Param('id') productId: string,
    @CurrentCompany() companyId: string,
    @Req() request?: Request,
  ) {
    const userId = (request as any)?.user?.id;
    return this.storeService.findRelatedProducts(productId, companyId, userId);
  }

  @Get('products/featured')
  @ApiOperation({
    summary: 'Listar produtos em destaque',
    description: 'Retorna produtos mais vendidos ou mais recentes',
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de produtos (padrão: 10)', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de produtos em destaque' })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findFeaturedProducts(
    @CurrentCompany() companyId: string,
    @Query('limit') limit?: number,
    @Req() request?: Request,
  ) {
    const userId = (request as any)?.user?.id;
    return this.storeService.findFeaturedProducts(companyId, limit ? Number(limit) : 10, userId);
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Listar categorias de produtos',
    description: 'Retorna todas as categorias únicas de produtos da empresa',
  })
  @ApiResponse({ status: 200, description: 'Lista de categorias' })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findAllCategories(@CurrentCompany() companyId: string, @Req() request?: Request) {
    const userId = (request as any)?.user?.id;
    return this.storeService.findAllCategories(companyId, userId);
  }
}
