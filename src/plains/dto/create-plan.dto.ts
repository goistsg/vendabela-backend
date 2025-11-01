import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Nome do plano',
    example: 'Plano Premium',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição do plano',
    example: 'Plano com recursos avançados',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Preço do plano',
    example: 99.90,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Recursos do plano (JSON object)',
    example: { maxProducts: 1000, maxUsers: 10 },
    required: false,
  })
  @IsOptional()
  features?: any; // JSON object for plan features

  @ApiProperty({
    description: 'Indica se é um plano interno',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
