import { IsNotEmpty, IsOptional, IsString, Matches, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserConsumerDto {
  @ApiProperty({
    description: 'Nome do usuário consumidor',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Número de WhatsApp (formato E.164)',
    example: '+5511999999999',
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'WhatsApp deve estar no formato E.164 (ex: +5511999999999)' })
  whatsapp: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
