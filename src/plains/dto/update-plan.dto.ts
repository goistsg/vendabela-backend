import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlanDto {
  @ApiProperty({
    description: 'Nome do plano',
    example: 'Plano Premium',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Descrição do plano',
    example: 'Plano com recursos avançados',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
