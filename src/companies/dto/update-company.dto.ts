import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa Exemplo Ltda',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Identificador único da empresa',
    example: 'EMPRESA-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  identifier?: string;

  @ApiProperty({
    description: 'Indica se a empresa é privada',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiProperty({
    description: 'Email do remetente',
    example: 'noreply@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  emailFrom?: string;

  @ApiProperty({
    description: 'Nome do remetente',
    example: 'Empresa Exemplo Ltda',
    required: false,
  })
  @IsOptional()
  @IsString()
  emailFromName?: string;

  @ApiProperty({
    description: 'Email para respostas',
    example: 'respostas@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  emailReplyTo?: string;

  @ApiProperty({
    description: 'URL do app/site da empresa',
    example: 'https://vendabela.com.br',
    required: false,
  })
  @IsOptional()
  @IsString()
  appUrl?: string;
}
