import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductsService } from '../services/products-service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Produtos')
@Controller('v1/products')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar produto', description: 'Cria um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos', description: 'Retorna todos os produtos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: any) {
    console.log(user);
    return this.productsService.findAll(user.id);
  }

  @Get('samples')
  @ApiOperation({ summary: 'Listar amostras', description: 'Retorna produtos que são amostras' })
  @ApiResponse({ status: 200, description: 'Lista de produtos amostra' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findSamples(@CurrentUser() user: any) {
    return this.productsService.findSamples(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter produto por ID', description: 'Retorna um produto específico' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto', description: 'Atualiza um produto existente' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: any) {
    return this.productsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produto', description: 'Remove um produto' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.remove(id, user.id);
  }
}
