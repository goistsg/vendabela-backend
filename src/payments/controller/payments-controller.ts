import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  Patch,
  Query,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from '../services/payments-service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentStatus } from '@prisma/client';

@ApiTags('Pagamentos')
@Controller('v1/payments')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pagamento', description: 'Cria um novo pagamento vinculado a um pedido' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreatePaymentDto })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos', description: 'Retorna todos os pagamentos ou filtra por status' })
  @ApiQuery({ name: 'status', enum: PaymentStatus, required: false, description: 'Filtrar por status do pagamento' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Query('status') status?: PaymentStatus) {
    if (status) {
      return this.paymentsService.findByStatus(status);
    }
    return this.paymentsService.findAll();
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Buscar pagamentos por pedido', description: 'Retorna todos os pagamentos de um pedido específico' })
  @ApiParam({ name: 'orderId', description: 'ID do pedido', type: String })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos do pedido' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrderId(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter pagamento por ID', description: 'Retorna um pagamento específico' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: String })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar pagamento', description: 'Atualiza um pagamento existente' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: String })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdatePaymentDto })
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pagamento', description: 'Atualiza apenas o status de um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: String })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ schema: { type: 'object', properties: { status: { enum: Object.values(PaymentStatus) } } } })
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: PaymentStatus
  ) {
    return this.paymentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar pagamento', description: 'Remove um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: String })
  @ApiResponse({ status: 200, description: 'Pagamento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}