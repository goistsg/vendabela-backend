import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateUserCompanyDto } from '../dto/create-user-company.dto';
import { UpdateUserCompanyDto } from '../dto/update-user-company.dto';
import { UserCompaniesService } from '../services/user-companies-service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Usuário-Empresa')
@Controller('v1/user-companies')
@UseGuards(AuthGuard)
@ApiBearerAuth('token')
export class UserCompaniesController {
  constructor(private readonly userCompaniesService: UserCompaniesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Criar vínculo usuário-empresa', description: 'Cria um vínculo entre um usuário e uma empresa (apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: CreateUserCompanyDto })
  async create(@Body() dto: CreateUserCompanyDto) {
    return this.userCompaniesService.create(dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar vínculos', description: 'Retorna vínculos usuário-empresa, opcionalmente filtrados por userId ou companyId (apenas Admin)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por ID do usuário', type: String })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filtrar por ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Lista de vínculos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findAll(@Query('userId') userId?: string, @Query('companyId') companyId?: string) {
    if (userId && companyId) {
      return this.userCompaniesService.findByUserAndCompany(userId, companyId);
    }
    if (userId) {
      return this.userCompaniesService.findByUser(userId);
    }
    if (companyId) {
      return this.userCompaniesService.findByCompany(companyId);
    }
    return this.userCompaniesService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obter vínculo por ID', description: 'Retorna um vínculo específico (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', type: String })
  @ApiResponse({ status: 200, description: 'Vínculo encontrado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findOne(@Param('id') id: string) {
    return this.userCompaniesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Atualizar vínculo', description: 'Atualiza um vínculo existente (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', type: String })
  @ApiResponse({ status: 200, description: 'Vínculo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: UpdateUserCompanyDto })
  async update(@Param('id') id: string, @Body() dto: UpdateUserCompanyDto) {
    return this.userCompaniesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Deletar vínculo por ID', description: 'Remove um vínculo pelo ID (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID do vínculo', type: String })
  @ApiResponse({ status: 200, description: 'Vínculo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async remove(@Param('id') id: string) {
    return this.userCompaniesService.remove(id);
  }

  @Delete('user/:userId/company/:companyId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Deletar vínculo por usuário e empresa', description: 'Remove um vínculo específico entre usuário e empresa (apenas Admin)' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: String })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Vínculo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async removeByUserAndCompany(@Param('userId') userId: string, @Param('companyId') companyId: string) {
    return this.userCompaniesService.removeByUserAndCompany(userId, companyId);
  }
}
