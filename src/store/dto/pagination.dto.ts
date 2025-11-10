import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de paginação para respostas paginadas
 */
export class PaginationDto {
  @ApiProperty({
    description: 'Número da página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de itens encontrados',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas disponíveis',
    example: 8,
  })
  totalPages: number;
}

