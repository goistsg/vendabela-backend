import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { StoreService } from '../services/store-service';
import { CurrentCompany } from '../decorators/current-company.decorator';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { StoreProductsResponseDto } from '../dto/store-products-response.dto';
import { StoreProductDetailDto, StoreProductDto } from '../dto/store-product.dto';
import { Request } from 'express';

@ApiTags('Loja')
@Controller('v1/store')
@UseGuards(OptionalAuthGuard)
@ApiHeader({
  name: 'company-id',
  description: 'ID da empresa (UUID)',
  required: true,
  example: '91db60be-bad5-4d40-85fb-93d73a5fb966',
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('products')
  @ApiOperation({
    summary: 'Listar produtos da loja',
    description: 'Retorna produtos da empresa com filtros, busca e paginação. Rota pública - não requer autenticação para empresas públicas.',
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoria (nome da categoria como string)', type: String, example: 'Chocolate' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome, SKU ou descrição', type: String, example: 'baunilha' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 20, máximo: 100)', type: Number, example: 20 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos com paginação',
    type: StoreProductsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação ou empresa não encontrada' })
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
    description: 'Retorna detalhes completos de um produto específico. Rota pública - não requer autenticação para empresas públicas.',
  })
  @ApiParam({ name: 'id', description: 'ID do produto (UUID)', type: String, example: '91db60be-bad5-4d40-85fb-93d73a5fb966' })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto encontrado',
    type: StoreProductDetailDto,
  })
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
    description: 'Retorna produtos relacionados baseado nas recomendações do produto. Rota pública - não requer autenticação para empresas públicas.',
  })
  @ApiParam({ name: 'id', description: 'ID do produto (UUID)', type: String, example: '91db60be-bad5-4d40-85fb-93d73a5fb966' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos relacionados',
    type: [StoreProductDto],
    isArray: true,
  })
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
    description: 'Retorna produtos mais vendidos ou mais recentes. Rota pública - não requer autenticação para empresas públicas.',
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de produtos (padrão: 10)', type: Number, example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos em destaque',
    type: [StoreProductDto],
    isArray: true,
  })
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
    description: 'Retorna todas as categorias únicas de produtos da empresa como array de strings. Rota pública - não requer autenticação para empresas públicas.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias (array de strings)',
    type: [String],
    isArray: true,
    example: ['Baunilha', 'Chocolate', 'Red Velvet'],
  })
  @ApiResponse({ status: 400, description: 'Empresa privada requer autenticação' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findAllCategories(@CurrentCompany() companyId: string, @Req() request?: Request): Promise<string[]> {
    const userId = (request as any)?.user?.id;
    return this.storeService.findAllCategories(companyId, userId);
  }
}
