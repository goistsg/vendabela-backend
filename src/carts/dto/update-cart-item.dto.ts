import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Nova quantidade do item',
    example: 3,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
