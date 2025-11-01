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
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      testerName: { type: 'string', example: 'João Silva' },
      whatsapp: { type: 'string', example: '+5511999999999', required: false },
      context: { type: 'object', example: { browser: 'Chrome', version: '1.0.0' }, required: false }
    },
    required: ['testerName']
  }})
  async startSession(@Body() testSession: CreateTestSessionDto) {
    return this.feedbacksService.startSession(testSession);
  }

  @Post()
  @ApiOperation({ summary: 'Criar feedback', description: 'Cria um novo feedback do usuário ou de teste' })
  @ApiResponse({ status: 201, description: 'Feedback criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000', required: false },
      testerName: { type: 'string', example: 'João Silva' },
      whatsapp: { type: 'string', example: '+5511999999999', required: false },
      screen: { type: 'string', example: 'Tela de Login', required: false },
      worked: { type: 'boolean', example: true, required: false },
      description: { type: 'string', example: 'Feedback descritivo', required: false },
      improvementSuggestion: { type: 'string', example: 'Sugestão de melhoria', required: false },
      untestedReason: { type: 'string', example: 'Motivo do não teste', required: false },
      userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000', required: false }
    },
    required: ['testerName']
  }})
  async createFeedback(@Body() userFeedback: CreateUserFeedbackDto) {
    return this.feedbacksService.create(userFeedback);
  }
}
