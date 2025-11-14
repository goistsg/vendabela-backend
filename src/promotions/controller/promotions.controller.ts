import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { PromotionsService } from '../services/promotions.service';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { ValidateCouponDto } from '../dto/validate-coupon.dto';
import { QueryPromotionsDto } from '../dto/query-promotions.dto';
import { ApplyPromotionDto } from '../dto/apply-promotion.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentCompany } from 'store/decorators/current-company.decorator';

@ApiTags('Promoções e Cupons')
@Controller('v1/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Criar promoção',
    description: 'Cria nova promoção/cupom de desconto (apenas Admin)',
  })
  @ApiResponse({ status: 201, description: 'Promoção criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async create(@Body() dto: CreatePromotionDto, @CurrentUser() user: any) {
    return this.promotionsService.create(dto, user.id);
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Listar promoções',
    description: 'Lista promoções com filtros e paginação',
  })
  @ApiResponse({ status: 200, description: 'Lista de promoções' })
  async findAll(@Query() query: QueryPromotionsDto) {
    return this.promotionsService.findAll(query, query.companyId);
  }

  @Get('company')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Listar promoções',
    description: 'Lista promoções com filtros e paginação',
  })
  @ApiHeader({
    name: 'company-id',
    description: 'ID da empresa (UUID)',
    required: true,
    example: '91db60be-bad5-4d40-85fb-93d73a5fb966',
  })
  @ApiResponse({ status: 200, description: 'Lista de promoções' })
  async findAllByCompany(@Query() query: QueryPromotionsDto, @CurrentCompany() companyId: string) {
    return this.promotionsService.findAll(query, companyId);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Listar promoções ativas',
    description: 'Lista apenas promoções ativas e dentro do período de validade',
  })
  @ApiResponse({ status: 200, description: 'Lista de promoções ativas' })
  async findActive() {
    return this.promotionsService.findAll({
      activeOnly: true,
      validOnly: true,
    });
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Buscar promoção por código',
    description: 'Retorna promoção pelo código do cupom',
  })
  @ApiParam({ name: 'code', description: 'Código do cupom' })
  @ApiResponse({ status: 200, description: 'Promoção encontrada' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  async findByCode(@Param('code') code: string) {
    return this.promotionsService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter promoção por ID',
    description: 'Retorna detalhes completos da promoção com estatísticas',
  })
  @ApiParam({ name: 'id', description: 'ID da promoção' })
  @ApiResponse({ status: 200, description: 'Detalhes da promoção' })
  @ApiResponse({ status: 404, description: 'Promoção não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Get(':id/stats')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Estatísticas da promoção',
    description: 'Retorna estatísticas de uso e performance (apenas Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID da promoção' })
  @ApiResponse({ status: 200, description: 'Estatísticas da promoção' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async getStats(@Param('id') id: string) {
    return this.promotionsService.getPromotionStats(id);
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Validar cupom',
    description: 'Valida se cupom pode ser aplicado ao carrinho e calcula desconto',
  })
  @ApiResponse({ status: 200, description: 'Cupom validado com sucesso' })
  @ApiResponse({ status: 400, description: 'Cupom inválido ou não aplicável' })
  @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
  async validateCoupon(@Body() dto: ValidateCouponDto, @CurrentUser() user: any) {
    return this.promotionsService.validateCoupon(dto, user.id);
  }

  @Post('apply')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Aplicar promoção',
    description: 'Aplica promoção a um pedido e registra o uso',
  })
  @ApiResponse({ status: 200, description: 'Promoção aplicada com sucesso' })
  @ApiResponse({ status: 400, description: 'Promoção não pode ser aplicada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Promoção ou pedido não encontrado' })
  async applyPromotion(@Body() dto: ApplyPromotionDto, @CurrentUser() user: any) {
    return this.promotionsService.applyPromotion(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Atualizar promoção',
    description: 'Atualiza promoção existente (apenas Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID da promoção' })
  @ApiResponse({ status: 200, description: 'Promoção atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiResponse({ status: 404, description: 'Promoção não encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Deletar promoção',
    description: 'Remove promoção do sistema (apenas Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID da promoção' })
  @ApiResponse({ status: 200, description: 'Promoção deletada com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiResponse({ status: 404, description: 'Promoção não encontrada' })
  async remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}

