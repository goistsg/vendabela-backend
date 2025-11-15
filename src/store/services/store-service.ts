import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista produtos da empresa com filtros e paginação
   */
  async findAllByCompany(
    companyId: string,
    options?: {
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
      orderBy?: string;
      userId?: string;
    },
  ) {
    const page = options?.page || 1;
    const limit = Math.min(options?.limit || 20, 100); // Máximo 100 por página
    const skip = (page - 1) * limit;

    const whereClause: any = { companyId };

    // Filtro por categoria
    if (options?.category) {
      whereClause.category = options.category;
    }

    // Busca por nome ou SKU
    if (options?.search) {
      whereClause.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (options?.orderBy) {
      const [field, direction] = options.orderBy.split(':');
      orderBy = { [
        field === 'name' ? 'name' :
        field === 'salePrice' ? 'salePrice' :
        'createdAt'
      ]: direction === 'asc' ? 'asc' : 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          category: true,
          sku: true,
          description: true,
          ingredients: true,
          imageUrls: true,
          salePrice: true,
          stock: true,
          hasSample: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca um produto específico por ID
   */
  async findOne(productId: string, companyId: string, userId?: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        companyId,
      },
      select: {
        id: true,
        name: true,
        category: true,
        sku: true,
        description: true,
        ingredients: true,
        imageUrls: true,
        recommendations: true,
        usageNotes: true,
        costPrice: true,
        lastPrice: true,
        salePrice: true,
        stock: true,
        hasSample: true,
        sampleQuantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return product;
  }

  /**
   * Lista categorias únicas da empresa
   */
  async findAllCategories(companyId: string, userId?: string) {
    const categories = await this.prisma.product.findMany({
      where: {
        companyId,
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Retorna array de strings (nomes das categorias)
    return categories
      .map((item) => item.category)
      .filter((category): category is string => category !== null);
  }

  /**
   * Lista produtos relacionados (baseado em recommendations)
   */
  async findRelatedProducts(productId: string, companyId: string, userId?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, companyId },
      select: { recommendations: true },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    if (!product.recommendations || product.recommendations.length === 0) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        companyId,
        id: { in: product.recommendations },
      },
      select: {
        id: true,
        name: true,
        category: true,
        sku: true,
        description: true,
        ingredients: true,
        imageUrls: true,
        salePrice: true,
        stock: true,
        hasSample: true,
      },
    });
  }

  /**
   * Lista produtos em destaque (mais vendidos ou mais recentes)
   */
  async findFeaturedProducts(companyId: string, limit: number = 10, userId?: string) {
    // Buscar produtos mais vendidos (com mais pedidos)
    const topProducts = await this.prisma.orderProduct.groupBy({
      by: ['productId'],
      where: {
        product: {
          companyId,
        },
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limit,
    });

    const productIds = topProducts.map((item) => item.productId);

    // Se não houver produtos vendidos, buscar os mais recentes
    if (productIds.length === 0) {
      return this.prisma.product.findMany({
        where: { companyId },
        select: {
          id: true,
          name: true,
          category: true,
          sku: true,
          description: true,
          ingredients: true,
          imageUrls: true,
          salePrice: true,
          stock: true,
          hasSample: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    }

    return this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        companyId,
      },
      select: {
        id: true,
        name: true,
        category: true,
        sku: true,
        description: true,
        ingredients: true,
        imageUrls: true,
        salePrice: true,
        stock: true,
        hasSample: true,
      },
    });
  }
}
