import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { ValidateCouponDto } from '../dto/validate-coupon.dto';
import { QueryPromotionsDto, PromotionSortBy } from '../dto/query-promotions.dto';
import { ApplyPromotionDto } from '../dto/apply-promotion.dto';
import { PromotionType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  private readonly logger = new Logger(PromotionsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova promoção
   */
  async create(dto: CreatePromotionDto, creatorId?: string) {
    // Validar código único se fornecido
    if (dto.code) {
      const existing = await this.prisma.promotion.findUnique({
        where: { code: dto.code },
      });

      if (existing) {
        throw new BadRequestException(`Código '${dto.code}' já está em uso`);
      }
    }

    // Validar BOGO
    if (dto.type === PromotionType.BOGO) {
      if (!dto.buyQuantity || !dto.getQuantity) {
        throw new BadRequestException('BOGO requer buyQuantity e getQuantity');
      }
      if (dto.getQuantity <= dto.buyQuantity) {
        throw new BadRequestException('getQuantity deve ser maior que buyQuantity');
      }
    }

    const promotion = await this.prisma.promotion.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        createdById: creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`Promotion created: ${promotion.name} (${promotion.code || 'no code'})`);

    return {
      promotion,
      message: 'Promoção criada com sucesso',
    };
  }

  /**
   * Listar promoções com filtros
   */
  async findAll(query: QueryPromotionsDto, companyId?: string) {
    const {
      type,
      activeOnly,
      validOnly,
      withCodeOnly,
      search,
      sortBy = PromotionSortBy.CREATED_DESC,
      page = 1,
      limit = 10,
    } = query;

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (activeOnly) {
      where.isActive = true;
    }

    if (validOnly) {
      const now = new Date();
      where.startDate = { lte: now };
      where.OR = [
        { endDate: null },
        { endDate: { gte: now } },
      ];
    }

    if (withCodeOnly) {
      where.code = { not: null };
    }

    if (companyId) {
      where.applicableCompanyIds = {
        has: companyId,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case PromotionSortBy.CREATED_DESC:
        orderBy = { createdAt: 'desc' };
        break;
      case PromotionSortBy.CREATED_ASC:
        orderBy = { createdAt: 'asc' };
        break;
      case PromotionSortBy.PRIORITY_DESC:
        orderBy = { priority: 'desc' };
        break;
      case PromotionSortBy.USAGE_DESC:
        orderBy = { usageCount: 'desc' };
        break;
      case PromotionSortBy.NAME_ASC:
        orderBy = { name: 'asc' };
        break;
    }

    // Paginação
    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              usages: true,
            },
          },
        },
      }),
      this.prisma.promotion.count({ where }),
    ]);

    return {
      promotions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar promoção por ID
   */
  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        usages: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            order: {
              select: {
                id: true,
                total: true,
              },
            },
          },
        },
        _count: {
          select: {
            usages: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada');
    }

    // Calcular estatísticas
    const stats = await this.getPromotionStats(id);

    return {
      ...promotion,
      stats,
    };
  }

  /**
   * Buscar promoção por código
   */
  async findByCode(code: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      throw new NotFoundException('Cupom não encontrado');
    }

    return promotion;
  }

  /**
   * Atualizar promoção
   */
  async update(id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada');
    }

    // Validar código único se alterado
    if (dto.code && dto.code !== promotion.code) {
      const existing = await this.prisma.promotion.findUnique({
        where: { code: dto.code },
      });

      if (existing) {
        throw new BadRequestException(`Código '${dto.code}' já está em uso`);
      }
    }

    const updated = await this.prisma.promotion.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      promotion: updated,
      message: 'Promoção atualizada com sucesso',
    };
  }

  /**
   * Deletar promoção
   */
  async remove(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada');
    }

    // Avisar se há usages
    if (promotion._count.usages > 0) {
      this.logger.warn(
        `Deleting promotion ${id} with ${promotion._count.usages} usages`,
      );
    }

    await this.prisma.promotion.delete({
      where: { id },
    });

    return {
      message: 'Promoção deletada com sucesso',
    };
  }

  /**
   * Validar cupom
   */
  async validateCoupon(dto: ValidateCouponDto, userId: string) {
    // Buscar promoção pelo código
    const promotion = await this.prisma.promotion.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (!promotion) {
      throw new NotFoundException('Cupom inválido');
    }

    // Validações
    const validation = await this.validatePromotion(
      promotion,
      userId,
      dto.orderTotal,
      dto.orderItems,
      dto.companyId,
    );

    if (!validation.isValid) {
      throw new BadRequestException(validation.reason);
    }

    // Calcular desconto
    const discountAmount = this.calculateDiscount(promotion, dto.orderTotal, dto.orderItems);

    return {
      isValid: true,
      promotion: {
        id: promotion.id,
        name: promotion.name,
        type: promotion.type,
        discountValue: promotion.discountValue,
        isFreeShipping: promotion.isFreeShipping,
      },
      discountAmount,
      finalTotal: Math.max(0, dto.orderTotal - discountAmount),
    };
  }

  /**
   * Aplicar promoção a um pedido
   */
  async applyPromotion(dto: ApplyPromotionDto, userId: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: dto.promotionId },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para modificar este pedido');
    }

    // Validar promoção
    const orderItems = order.products.map((p) => ({
      productId: p.productId,
      category: p.product.category,
      quantity: p.quantity,
      price: p.price,
    }));

    const validation = await this.validatePromotion(
      promotion,
      userId,
      order.total,
      orderItems,
      order.companyId,
    );

    if (!validation.isValid) {
      throw new BadRequestException(validation.reason);
    }

    // Calcular desconto
    const discountApplied = this.calculateDiscount(promotion, order.total, orderItems);

    // Registrar uso
    const usage = await this.prisma.promotionUsage.create({
      data: {
        promotionId: promotion.id,
        userId,
        orderId: order.id,
        discountApplied,
      },
    });

    // Incrementar contador
    await this.prisma.promotion.update({
      where: { id: promotion.id },
      data: {
        usageCount: { increment: 1 },
      },
    });

    // Atualizar desconto no pedido
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        discount: discountApplied,
        total: Math.max(0, order.total - discountApplied),
      },
    });

    this.logger.log(`Promotion ${promotion.code} applied to order ${order.id}: -R$ ${discountApplied}`);

    return {
      usage,
      promotion,
      discountApplied,
      message: 'Promoção aplicada com sucesso',
    };
  }

  /**
   * Obter estatísticas de uma promoção
   */
  async getPromotionStats(promotionId: string) {
    const [usageCount, totalDiscount, uniqueUsers] = await Promise.all([
      this.prisma.promotionUsage.count({
        where: { promotionId },
      }),
      this.prisma.promotionUsage.aggregate({
        where: { promotionId },
        _sum: {
          discountApplied: true,
        },
      }),
      this.prisma.promotionUsage.groupBy({
        by: ['userId'],
        where: { promotionId },
        _count: true,
      }),
    ]);

    return {
      totalUses: usageCount,
      totalDiscountGiven: totalDiscount._sum.discountApplied || 0,
      uniqueUsers: uniqueUsers.length,
      averageDiscountPerUse: usageCount > 0
        ? (totalDiscount._sum.discountApplied || 0) / usageCount
        : 0,
    };
  }

  // ====== MÉTODOS AUXILIARES PRIVADOS ======

  /**
   * Validar se promoção pode ser aplicada
   */
  private async validatePromotion(
    promotion: any,
    userId: string,
    orderTotal: number,
    orderItems: any[],
    companyId?: string,
  ): Promise<{ isValid: boolean; reason?: string }> {
    // 1. Promoção está ativa?
    if (!promotion.isActive) {
      return { isValid: false, reason: 'Promoção inativa' };
    }

    // 2. Está dentro do período?
    const now = new Date();
    if (now < promotion.startDate) {
      return { isValid: false, reason: 'Promoção ainda não iniciou' };
    }

    if (promotion.endDate && now > promotion.endDate) {
      return { isValid: false, reason: 'Promoção expirada' };
    }

    // 3. Limite de usos atingido?
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { isValid: false, reason: 'Limite de usos atingido' };
    }

    // 4. Limite por usuário atingido?
    if (promotion.usageLimitPerUser) {
      const userUsages = await this.prisma.promotionUsage.count({
        where: {
          promotionId: promotion.id,
          userId,
        },
      });

      if (userUsages >= promotion.usageLimitPerUser) {
        return { isValid: false, reason: 'Você já atingiu o limite de usos desta promoção' };
      }
    }

    // 5. Valor mínimo de compra?
    if (promotion.minPurchaseAmount && orderTotal < promotion.minPurchaseAmount) {
      return {
        isValid: false,
        reason: `Valor mínimo de compra: R$ ${promotion.minPurchaseAmount.toFixed(2)}`,
      };
    }

    // 6. Quantidade mínima?
    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    if (promotion.minQuantity && totalQuantity < promotion.minQuantity) {
      return {
        isValid: false,
        reason: `Quantidade mínima de itens: ${promotion.minQuantity}`,
      };
    }

    // 7. Primeira compra?
    if (promotion.isFirstPurchaseOnly) {
      const orderCount = await this.prisma.order.count({
        where: { userId },
      });

      if (orderCount > 0) {
        return { isValid: false, reason: 'Válido apenas para primeira compra' };
      }
    }

    // 8. Produtos aplicáveis?
    if (promotion.applicableProductIds.length > 0) {
      const hasApplicableProduct = orderItems.some((item) =>
        promotion.applicableProductIds.includes(item.productId),
      );

      if (!hasApplicableProduct) {
        return { isValid: false, reason: 'Nenhum produto aplicável no carrinho' };
      }
    }

    // 9. Categorias aplicáveis?
    if (promotion.applicableCategories.length > 0) {
      const hasApplicableCategory = orderItems.some((item) =>
        promotion.applicableCategories.includes(item.category),
      );

      if (!hasApplicableCategory) {
        return { isValid: false, reason: 'Nenhuma categoria aplicável no carrinho' };
      }
    }

    // 10. Empresa aplicável (multi-tenant)?
    if (promotion.applicableCompanyIds.length > 0 && companyId) {
      if (!promotion.applicableCompanyIds.includes(companyId)) {
        return { isValid: false, reason: 'Promoção não aplicável para esta empresa' };
      }
    }

    return { isValid: true };
  }

  /**
   * Calcular valor do desconto
   */
  private calculateDiscount(
    promotion: any,
    orderTotal: number,
    orderItems: any[],
  ): number {
    switch (promotion.type) {
      case PromotionType.PERCENTAGE:
        let discount = orderTotal * (promotion.discountValue / 100);
        if (promotion.maxDiscountAmount) {
          discount = Math.min(discount, promotion.maxDiscountAmount);
        }
        return Math.round(discount * 100) / 100;

      case PromotionType.FIXED_AMOUNT:
        return Math.min(promotion.discountValue, orderTotal);

      case PromotionType.FREE_SHIPPING:
        // Aqui você retornaria o valor do frete
        // Por enquanto, retorna 0 (implementar lógica de frete)
        return 0;

      case PromotionType.BOGO:
        // Lógica BOGO simplificada
        const applicableItems = orderItems.filter((item) =>
          promotion.applicableProductIds.length === 0 ||
          promotion.applicableProductIds.includes(item.productId),
        );

        const totalQty = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
        const sets = Math.floor(totalQty / promotion.buyQuantity);
        const freeItems = sets * (promotion.getQuantity - promotion.buyQuantity);

        // Pegar os itens de menor valor para serem grátis
        const prices = applicableItems.flatMap((item) =>
          Array(item.quantity).fill(item.price),
        ).sort((a, b) => a - b);

        const freeItemsValue = prices.slice(0, freeItems).reduce((sum, price) => sum + price, 0);
        return Math.round(freeItemsValue * 100) / 100;

      case PromotionType.FIXED_PRICE:
        // Define preço fixo para produtos específicos
        const applicableProducts = orderItems.filter((item) =>
          promotion.applicableProductIds.includes(item.productId),
        );

        const originalTotal = applicableProducts.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        const newTotal = applicableProducts.reduce(
          (sum, item) => sum + promotion.discountValue * item.quantity,
          0,
        );

        return Math.max(0, Math.round((originalTotal - newTotal) * 100) / 100);

      case PromotionType.QUANTITY_DISCOUNT:
        const totalQtyDiscount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQtyDiscount >= (promotion.minQuantity || 0)) {
          const discount = orderTotal * (promotion.discountValue / 100);
          return Math.round(discount * 100) / 100;
        }
        return 0;

      default:
        return 0;
    }
  }
}

