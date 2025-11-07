import { 
  Controller, 
  UseGuards, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RafflesService } from '../services/raffles-service';
import { CreateRaffleDto } from '../dto/create-raffle.dto';
import { UpdateRaffleDto } from '../dto/update-raffle.dto';
import { CreateRaffleEntryDto } from '../dto/raffle-entry.dto';

@ApiTags('Sorteios')
@Controller('v1/raffles')
@UseGuards(AuthGuard)
@ApiBearerAuth('token')
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar sorteio', description: 'Cria um novo sorteio' })
  @ApiResponse({ status: 201, description: 'Sorteio criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateRaffleDto })
  create(@CurrentUser() user: any, @Body() createRaffleDto: CreateRaffleDto) {
    return this.rafflesService.create(user.id, createRaffleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sorteios', description: 'Retorna todos os sorteios do usuário, opcionalmente filtrados por empresa' })
  @ApiQuery({ name: 'companyId', required: false, description: 'ID da empresa para filtrar sorteios', type: String })
  @ApiResponse({ status: 200, description: 'Lista de sorteios' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(
    @CurrentUser() user: any,
    @Query('companyId') companyId?: string
  ) {
    return this.rafflesService.findAll(user.id, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter sorteio por ID', description: 'Retorna um sorteio específico' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Sorteio encontrado' })
  @ApiResponse({ status: 404, description: 'Sorteio não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.rafflesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sorteio', description: 'Atualiza um sorteio existente' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Sorteio atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Sorteio não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateRaffleDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() updateRaffleDto: UpdateRaffleDto
  ) {
    return this.rafflesService.update(id, user.id, updateRaffleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar sorteio', description: 'Remove um sorteio' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Sorteio deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Sorteio não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.rafflesService.remove(id, user.id);
  }

  @Post(':id/entries')
  @ApiOperation({ summary: 'Inscrever cliente no sorteio', description: 'Adiciona uma inscrição de cliente no sorteio' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Cliente inscrito com sucesso' })
  @ApiResponse({ status: 400, description: 'Limite de inscrições atingido ou cliente já inscrito' })
  @ApiResponse({ status: 404, description: 'Sorteio ou cliente não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateRaffleEntryDto })
  addEntry(
    @Param('id', ParseUUIDPipe) raffleId: string,
    @CurrentUser() user: any,
    @Body() createRaffleEntryDto: CreateRaffleEntryDto
  ) {
    return this.rafflesService.addEntry(raffleId, user.id, createRaffleEntryDto);
  }

  @Delete(':id/entries/:entryId')
  @ApiOperation({ summary: 'Remover inscrição', description: 'Remove uma inscrição do sorteio' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiParam({ name: 'entryId', description: 'ID da inscrição', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Inscrição removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  removeEntry(
    @Param('id', ParseUUIDPipe) raffleId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
    @CurrentUser() user: any
  ) {
    return this.rafflesService.removeEntry(raffleId, entryId, user.id);
  }

  @Get(':id/entries')
  @ApiOperation({ summary: 'Listar inscrições', description: 'Retorna todas as inscrições de um sorteio' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Lista de inscrições' })
  @ApiResponse({ status: 404, description: 'Sorteio não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  getEntries(
    @Param('id', ParseUUIDPipe) raffleId: string,
    @CurrentUser() user: any
  ) {
    return this.rafflesService.getEntries(raffleId, user.id);
  }

  @Post(':id/draw')
  @ApiOperation({ summary: 'Realizar sorteio', description: 'Realiza o sorteio e seleciona os vencedores' })
  @ApiParam({ name: 'id', description: 'ID do sorteio', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Sorteio realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Sorteio não pode ser realizado (ainda não chegou a data ou já foi realizado)' })
  @ApiResponse({ status: 404, description: 'Sorteio não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  drawRaffle(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.rafflesService.drawRaffle(id, user.id);
  }
}