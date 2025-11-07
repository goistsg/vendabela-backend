import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ClientsService } from '../services/clients-service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Clientes')
@Controller('v1/clients')
@UseGuards(AuthGuard)
@ApiBearerAuth('token')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar cliente', description: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateClientDto })
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: any) {
    return this.clientsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes', description: 'Retorna todos os clientes do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: any) {
    return this.clientsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente por ID', description: 'Retorna um cliente específico' })
  @ApiParam({ name: 'id', description: 'ID do cliente', type: String })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente', description: 'Atualiza um cliente existente' })
  @ApiParam({ name: 'id', description: 'ID do cliente', type: String })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateClientDto })
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto, @CurrentUser() user: any) {
    return this.clientsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar cliente', description: 'Remove um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente', type: String })
  @ApiResponse({ status: 200, description: 'Cliente deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.remove(id, user.id);
  }
}
