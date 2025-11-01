import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CartsService } from '../services/carts-service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Carrinho')
@Controller('v1/cart')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':companyId')
  @ApiOperation({ summary: 'Obter carrinho', description: 'Retorna o carrinho do usuário para uma empresa específica' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Carrinho encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  getCart(@CurrentUser() user: any, @Param('companyId') companyId: string) {
    return this.cartsService.getCart(user.id, companyId);
  }

  @Post(':companyId/items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho', description: 'Adiciona um produto ao carrinho' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 201, description: 'Item adicionado ao carrinho' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: AddToCartDto })
  addToCart(@CurrentUser() user: any, @Param('companyId') companyId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(user.id, companyId, addToCartDto);
  }

  @Put(':companyId/items/:itemId')
  @ApiOperation({ summary: 'Atualizar item do carrinho', description: 'Atualiza a quantidade de um item no carrinho' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho', type: String })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateCartItemDto })
  updateCartItem(
    @CurrentUser() user: any,
    @Param('companyId') companyId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(user.id, companyId, itemId, updateCartItemDto);
  }

  @Delete(':companyId/items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho', description: 'Remove um item do carrinho' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho', type: String })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  removeFromCart(@CurrentUser() user: any, @Param('companyId') companyId: string, @Param('itemId') itemId: string) {
    return this.cartsService.removeFromCart(user.id, companyId, itemId);
  }

  @Delete(':companyId')
  @ApiOperation({ summary: 'Limpar carrinho', description: 'Remove todos os itens do carrinho' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  clearCart(@CurrentUser() user: any, @Param('companyId') companyId: string) {
    return this.cartsService.clearCart(user.id, companyId);
  }
}
