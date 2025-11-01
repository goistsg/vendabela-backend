import { 
  Controller, 
  UseGuards, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { PlainsService } from '../services/plains-service';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { UpdatePlanDto } from '../dto/update-plan.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Planos')
@Controller('v1/plains')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class PlainsController {
  constructor(private readonly plainsService: PlainsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Criar plano', description: 'Cria um novo plano de assinatura (apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: CreatePlanDto })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plainsService.create(createPlanDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar planos', description: 'Retorna todos os planos (apenas Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de planos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findAll() {
    return this.plainsService.findAll();
  }

  @Get('public')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar planos públicos', description: 'Retorna apenas planos públicos (apenas Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de planos públicos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async getPublicPlans() {
    return this.plainsService.getPublicPlans();
  }

  @Get('internal')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar planos internos', description: 'Retorna apenas planos internos (apenas Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de planos internos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async getInternalPlans() {
    return this.plainsService.getInternalPlans();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obter plano por ID', description: 'Retorna um plano específico (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Plano encontrado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plainsService.findOne(id);
  }

  @Get(':id/users')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar usuários do plano', description: 'Retorna todos os usuários associados a um plano (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Lista de usuários do plano' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async getPlanUsers(@Param('id', ParseUUIDPipe) id: string) {
    return this.plainsService.getPlanUsers(id);
  }

  @Get(':id/stats')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obter estatísticas do plano', description: 'Retorna estatísticas de um plano (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Estatísticas do plano' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async getPlanStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.plainsService.getPlanStats(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Atualizar plano', description: 'Atualiza um plano existente (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: UpdatePlanDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto
  ) {
    return this.plainsService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Deletar plano', description: 'Remove um plano (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Plano deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plainsService.remove(id);
  }
}