import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReviewSortBy {
  RECENT = 'recent',
  HELPFUL = 'helpful',
  RATING_HIGH = 'rating_high',
  RATING_LOW = 'rating_low',
}

export enum ReviewStatusFilter {
  ALL = 'all',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export class QueryReviewsDto {
  @ApiPropertyOptional({
    description: 'ID do produto para filtrar',
    example: 'uuid-do-produto',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: ReviewStatusFilter,
    example: ReviewStatusFilter.APPROVED,
  })
  @IsOptional()
  @IsEnum(ReviewStatusFilter)
  status?: ReviewStatusFilter;

  @ApiPropertyOptional({
    description: 'Apenas compras verificadas',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  verifiedPurchaseOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Ordenar por',
    enum: ReviewSortBy,
    example: ReviewSortBy.RECENT,
  })
  @IsOptional()
  @IsEnum(ReviewSortBy)
  sortBy?: ReviewSortBy;

  @ApiPropertyOptional({
    description: 'Página (para paginação)',
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

  @ApiPropertyOptional({
    description: 'Buscar por texto (título ou comentário)',
    example: 'excelente',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

