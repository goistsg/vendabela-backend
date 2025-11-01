import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyRole } from './create-user-company.dto';

export class UpdateUserCompanyDto {
  @ApiProperty({
    description: 'ID do segmento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  segmentId?: string;

  @ApiProperty({
    description: 'Papel/função do usuário na empresa',
    enum: CompanyRole,
    example: CompanyRole.CONSULTORA,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyRole)
  role?: CompanyRole;
}
