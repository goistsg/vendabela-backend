import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CompanyRole {
  CONSUMER = 'CONSUMER', // Cliente final
  CONSULTANT = 'CONSULTANT', // Consultora (quem vende)
  DIRECTOR = 'DIRECTOR', // Diretora (superior hierárquico das consultoras)
  COMPANY_ADMIN = 'COMPANY_ADMIN', // Admin da empresa ou da rede
  STORE = 'STORE', // Loja física / unidade comercial
}

export class CreateUserCompanyDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    description: 'ID do segmento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  segmentId: string;

  @ApiProperty({
    description: 'Papel/função do usuário na empresa',
    enum: CompanyRole,
    example: CompanyRole.CONSULTANT,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyRole)
  role?: CompanyRole;
}
