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
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsReviewService } from '../services/products-review-service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { SellerResponseDto } from '../dto/seller-response.dto';
import { MarkHelpfulDto } from '../dto/mark-helpful.dto';
import { ReportReviewDto } from '../dto/report-review.dto';
import { ModerateReviewDto } from '../dto/moderate-review.dto';
import { QueryReviewsDto } from '../dto/query-reviews.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Avaliações de Produtos')
@Controller('v1/reviews')
export class ProductsReviewController {
  constructor(private readonly reviewsService: ProductsReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Criar avaliação de produto',
    description: 'Permite que um usuário autenticado avalie um produto',
  })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário já avaliou' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async create(@Body() dto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar avaliações',
    description: 'Lista avaliações com filtros e paginação',
  })
  @ApiResponse({ status: 200, description: 'Lista de avaliações' })
  async findAll(@Query() query: QueryReviewsDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('product/:productId/stats')
  @ApiOperation({
    summary: 'Estatísticas de avaliações de um produto',
    description: 'Retorna média, total e distribuição de ratings',
  })
  @ApiParam({ name: 'productId', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Estatísticas do produto' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async getProductStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductStats(productId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter avaliação por ID',
    description: 'Retorna detalhes completos de uma avaliação',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Detalhes da avaliação' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Atualizar avaliação',
    description: 'Permite que o autor atualize sua própria avaliação',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Deletar avaliação',
    description: 'Permite que o autor ou admin delete a avaliação',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação deletada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const isAdmin = user.plan?.name === 'ADMIN';
    return this.reviewsService.remove(id, user.id, isAdmin);
  }

  @Post(':id/seller-response')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Responder avaliação (vendedor)',
    description: 'Permite que o vendedor responda a uma avaliação',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Resposta adicionada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async addSellerResponse(
    @Param('id') id: string,
    @Body() dto: SellerResponseDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.addSellerResponse(id, dto, user.id);
  }

  @Post(':id/helpful')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Marcar avaliação como útil/não útil',
    description: 'Permite que usuários votem se a avaliação foi útil',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Voto registrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async markHelpful(
    @Param('id') id: string,
    @Body() dto: MarkHelpfulDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.markHelpful(id, dto, user.id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Reportar avaliação',
    description: 'Permite que usuários denunciem avaliações inadequadas',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Denúncia registrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async report(
    @Param('id') id: string,
    @Body() dto: ReportReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.report(id, dto, user.id);
  }

  @Patch(':id/moderate')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Moderar avaliação (admin)',
    description: 'Permite que admins aprovem ou rejeitem avaliações',
  })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação moderada com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async moderate(
    @Param('id') id: string,
    @Body() dto: ModerateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.moderate(id, dto, user.id);
  }
}

