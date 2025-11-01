import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FeedbacksService } from '../services/feedbacks-service';
import { CreateUserFeedbackDto } from '../dto/create-user-feedback.dto';
import { CreateTestSessionDto } from '../dto/create-test-session.dto';

@ApiTags('Feedbacks')
@Controller('v1/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post('session/start')
  @ApiOperation({ summary: 'Iniciar sessão de teste', description: 'Inicia uma nova sessão de teste para coleta de feedbacks' })
  @ApiResponse({ status: 201, description: 'Sessão iniciada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateTestSessionDto })
  async startSession(@Body() testSession: CreateTestSessionDto) {
    return this.feedbacksService.startSession(testSession);
  }

  @Post()
  @ApiOperation({ summary: 'Criar feedback', description: 'Cria um novo feedback do usuário ou de teste' })
  @ApiResponse({ status: 201, description: 'Feedback criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateUserFeedbackDto })
  async createFeedback(@Body() userFeedback: CreateUserFeedbackDto) {
    return this.feedbacksService.create(userFeedback);
  }
}
