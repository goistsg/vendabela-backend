import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { CartsService } from '../services/carts-service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentCompany } from '../../store/decorators/current-company.decorator';

@ApiTags('Carrinho')
@Controller('v1/cart')
@UseGuards(AuthGuard)
@ApiBearerAuth('token')
@ApiHeader({
  name: 'company-id',
  description: 'ID da empresa (UUID)',
  required: true,
  example: '91db60be-bad5-4d40-85fb-93d73a5fb966',
})
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Obter carrinho', description: 'Retorna o carrinho do usuário para uma empresa específica. O company-id deve ser enviado no header.' })
  @ApiResponse({ status: 200, description: 'Carrinho encontrado' })
  @ApiResponse({ status: 400, description: 'ID da empresa não fornecido no header' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  getCart(@CurrentUser() user: any, @CurrentCompany() companyId: string) {
    return this.cartsService.getCart(user.id, companyId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho', description: 'Adiciona um produto ao carrinho. O company-id deve ser enviado no header.' })
  @ApiResponse({ status: 201, description: 'Item adicionado ao carrinho' })
  @ApiResponse({ status: 400, description: 'ID da empresa não fornecido no header' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: AddToCartDto })
  addToCart(@CurrentUser() user: any, @CurrentCompany() companyId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(user.id, companyId, addToCartDto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Atualizar item do carrinho', description: 'Atualiza a quantidade de um item no carrinho. O company-id deve ser enviado no header.' })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho', type: String })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'ID da empresa não fornecido no header' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateCartItemDto })
  updateCartItem(
    @CurrentUser() user: any,
    @CurrentCompany() companyId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(user.id, companyId, itemId, updateCartItemDto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho', description: 'Remove um item do carrinho. O company-id deve ser enviado no header.' })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho', type: String })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 400, description: 'ID da empresa não fornecido no header' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  removeFromCart(@CurrentUser() user: any, @CurrentCompany() companyId: string, @Param('itemId') itemId: string) {
    return this.cartsService.removeFromCart(user.id, companyId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Limpar carrinho', description: 'Remove todos os itens do carrinho. O company-id deve ser enviado no header.' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  @ApiResponse({ status: 400, description: 'ID da empresa não fornecido no header' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  clearCart(@CurrentUser() user: any, @CurrentCompany() companyId: string) {
    return this.cartsService.clearCart(user.id, companyId);
  }
}
