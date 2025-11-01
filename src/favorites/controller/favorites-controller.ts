import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites-service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ProductFavoriteDto } from '../dto/product-favorite.dto';

@ApiTags('Favoritos')
@Controller('v1/favorites')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Adicionar favorito', description: 'Adiciona um produto aos favoritos do usuário' })
  @ApiParam({ name: 'productId', description: 'ID do produto', type: String })
  @ApiResponse({ status: 201, description: 'Produto adicionado aos favoritos' })
  @ApiResponse({ status: 400, description: 'Produto já está nos favoritos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: ProductFavoriteDto })
  async create(@Body() dto: ProductFavoriteDto, @CurrentUser() user: any) {
    return this.favoritesService.create(user.id, dto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remover favorito', description: 'Remove um produto dos favoritos do usuário' })
  @ApiParam({ name: 'productId', description: 'ID do produto', type: String })
  @ApiResponse({ status: 200, description: 'Favorito removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Favorito não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: ProductFavoriteDto })
  async remove(@Body() dto: ProductFavoriteDto, @CurrentUser() user: any) {
    await this.favoritesService.remove(user.id, dto);
    return { message: 'Favorito removido com sucesso' };
  }

  @Get(':companyId')
  @ApiOperation({ summary: 'Listar favoritos', description: 'Retorna todos os produtos favoritos do usuário para uma empresa específica' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Lista de produtos favoritos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: any, @Param('companyId') companyId: string) {
    return this.favoritesService.findAll(user.id, companyId);
  }
}