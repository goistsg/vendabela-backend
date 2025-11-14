import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionType } from '@prisma/client';

export enum PromotionSortBy {
  CREATED_DESC = 'created_desc',
  CREATED_ASC = 'created_asc',
  PRIORITY_DESC = 'priority_desc',
  USAGE_DESC = 'usage_desc',
  NAME_ASC = 'name_asc',
}

export class QueryPromotionsDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo',
    enum: PromotionType,
    example: PromotionType.PERCENTAGE,
  })
  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @ApiPropertyOptional({
    description: 'Apenas promoções ativas',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activeOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Apenas promoções válidas (dentro do período)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  validOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Apenas com código de cupom',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withCodeOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por empresa (multi-tenant)',
    example: 'company-uuid',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Buscar por nome ou descrição',
    example: 'black friday',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Ordenar por',
    enum: PromotionSortBy,
    example: PromotionSortBy.CREATED_DESC,
  })
  @IsOptional()
  @IsEnum(PromotionSortBy)
  sortBy?: PromotionSortBy;

  @ApiPropertyOptional({
    description: 'Página',
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Itens por página',
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

