import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersService } from '../services/orders-service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CartCheckoutDto } from '../dto/cart-checkout.dto';

@ApiTags('Pedidos')
@Controller('v1/orders')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido', description: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(dto, user.id);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout do carrinho', description: 'Realiza checkout de um carrinho de compras, criando um pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso a partir do carrinho' })
  @ApiResponse({ status: 400, description: 'Carrinho inválido ou vazio' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CartCheckoutDto })
  async checkout(@Body() dto: CartCheckoutDto, @CurrentUser() user: any) {
    return this.ordersService.cartCheckout(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos', description: 'Retorna todos os pedidos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter pedido por ID', description: 'Retorna um pedido específico' })
  @ApiParam({ name: 'id', description: 'ID do pedido', type: String })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pedido', description: 'Atualiza um pedido existente' })
  @ApiParam({ name: 'id', description: 'ID do pedido', type: String })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateOrderDto })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar pedido', description: 'Remove um pedido' })
  @ApiParam({ name: 'id', description: 'ID do pedido', type: String })
  @ApiResponse({ status: 200, description: 'Pedido deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.remove(id, user.id);
  }
}
