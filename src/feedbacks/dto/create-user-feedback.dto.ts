import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserFeedbackDto {
  @ApiProperty({
    description: 'ID da sessão de teste (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  sessionId?: string; // opcional — caso seja teste

  @ApiProperty({
    description: 'Nome do testador/usuário',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  testerName: string;

  @ApiProperty({
    description: 'Número de WhatsApp',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({
    description: 'Nome da tela/funcionalidade testada',
    example: 'Tela de Login',
    required: false,
  })
  @IsOptional()
  @IsString()
  screen?: string; // nome da tela/funcionalidade

  @ApiProperty({
    description: 'Indica se funcionou corretamente',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  worked?: boolean;

  @ApiProperty({
    description: 'Descrição do feedback',
    example: 'Feedback descritivo sobre a funcionalidade',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Sugestão de melhoria',
    example: 'Sugestão de melhoria para a funcionalidade',
    required: false,
  })
  @IsOptional()
  @IsString()
  improvementSuggestion?: string;

  @ApiProperty({
    description: 'Motivo pelo qual não foi testado',
    example: 'Funcionalidade não disponível no ambiente de teste',
    required: false,
  })
  @IsOptional()
  @IsString()
  untestedReason?: string;

  @ApiProperty({
    description: 'ID do usuário (opcional - usado no modo produção)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string; // opcional — usado no modo produção
}