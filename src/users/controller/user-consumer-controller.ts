import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserConsumerDto } from '../dto/create-user-consumer.dto';
import { UsersService } from '../services/users-service';

@ApiTags('Usuários-Consumidor')
@Controller('v1/users/consumer')
export class UserConsumerController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário consumidor', description: 'Cria um novo usuário consumidor' })
  @ApiResponse({ status: 201, description: 'Usuário consumidor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: CreateUserConsumerDto })
  async create(@Body() dto: CreateUserConsumerDto) {
    return this.usersService.createConsumer(dto);
  }
}
