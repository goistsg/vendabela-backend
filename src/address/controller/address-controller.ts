import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AddressService } from '../services/address-service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RemoveAddressService } from '../services/remove-address-service';

@ApiTags('Endereços')
@Controller('v1/addresses')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly removeAddressService: RemoveAddressService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar endereços', description: 'Retorna todos os endereços do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de endereços' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: any) {
    return this.addressService.findAll(user.id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Listar endereços por cliente', description: 'Retorna todos os endereços de um cliente específico' })
  @ApiParam({ name: 'clientId', description: 'ID do cliente', type: String })
  @ApiResponse({ status: 200, description: 'Lista de endereços do cliente' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAllByClient(@Param('clientId') clientId: string, @CurrentUser() user: any) {
    return this.addressService.findAllByClient(clientId, user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Listar endereços do usuário', description: 'Retorna todos os endereços do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de endereços do usuário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAllByUser(@CurrentUser() user: any) {
    return this.addressService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter endereço por ID', description: 'Retorna um endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço', type: String })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.addressService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar endereço', description: 'Cria um novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateAddressDto })
  async create(@Body() dto: CreateAddressDto, @CurrentUser() user: any) {
    return this.addressService.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar endereço', description: 'Atualiza um endereço existente' })
  @ApiParam({ name: 'id', description: 'ID do endereço', type: String })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateAddressDto })
  async update(@Param('id') id: string, @Body() dto: UpdateAddressDto, @CurrentUser() user: any) {
    return this.addressService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar endereço', description: 'Remove um endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço', type: String })
  @ApiResponse({ status: 200, description: 'Endereço deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.removeAddressService.remove(id, user.id);
  }
}
