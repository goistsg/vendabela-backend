import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestSessionDto {
  @ApiProperty({
    description: 'Nome do testador',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  testerName: string;

  @ApiProperty({
    description: 'Número de WhatsApp do testador',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({
    description: 'Contexto do teste (browser, versão, etc.)',
    example: { browser: 'Chrome', version: '1.0.0' },
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>; // Ex: { browser: "Chrome", version: "1.0.0" }
}