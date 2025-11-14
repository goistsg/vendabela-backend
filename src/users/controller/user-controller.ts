import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UsersService } from '../services/users-service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Usuários')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ====== REGISTRO (SEM AUTENTICAÇÃO) ======

  @Post()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Criar usuário / Registrar-se',
    description:
      'Cria nova conta de usuário no sistema. Pode ser usado para auto-registro (público) ou por admin para criar usuários.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já cadastrado',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto, @CurrentUser() currentUser?: any) {
    return this.usersService.create(dto, currentUser);
  }

  // ====== GERENCIAMENTO (REQUER AUTENTICAÇÃO) ======

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna lista completa de usuários (apenas Admin)',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Obter usuário por ID',
    description:
      'Usuários podem ver apenas seu próprio perfil, admins podem ver qualquer usuário',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({
    status: 403,
    description: 'Você só pode visualizar seu próprio perfil',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    // Usuários podem ver apenas seu próprio perfil, admins podem ver qualquer usuário
    const isAdmin = user.plan?.name === 'ADMIN';
    if (!isAdmin && user.id !== id) {
      throw new ForbiddenException('Você só pode visualizar seu próprio perfil');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Usuário pode atualizar próprio perfil, admin pode atualizar qualquer usuário',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: String })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Você só pode atualizar seu próprio perfil',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    const isAdmin = user.plan?.name === 'ADMIN';
    if (!isAdmin && user.id !== id) {
      throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
    }
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema (apenas Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: String })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas Admin' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ====== TROCAR SENHA (AUTENTICADO) ======

  @Patch(':id/password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Trocar senha',
    description:
      'Usuário pode trocar sua própria senha informando a senha atual',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: String })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  @ApiResponse({
    status: 403,
    description: 'Você só pode trocar sua própria senha',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: any,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Você só pode trocar sua própria senha');
    }
    return this.usersService.changePassword(id, dto);
  }
}
