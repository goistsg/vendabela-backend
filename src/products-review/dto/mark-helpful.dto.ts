import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MarkHelpfulDto {
  @ApiProperty({
    description: 'True = útil, False = não útil',
    example: true,
  })
  @IsBoolean()
  isHelpful: boolean;
}

