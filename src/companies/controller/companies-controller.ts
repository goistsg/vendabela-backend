import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompaniesService } from '../services/companies-service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Empresas')
@Controller('v1/companies')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Criar empresa', description: 'Cria uma nova empresa (apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: CreateCompanyDto })
  async create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar empresas', description: 'Retorna todas as empresas (apenas Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obter empresa por ID', description: 'Retorna uma empresa específica (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Atualizar empresa', description: 'Atualiza uma empresa existente (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  @ApiBody({ type: UpdateCompanyDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Deletar empresa', description: 'Remove uma empresa (apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID da empresa', type: String })
  @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
