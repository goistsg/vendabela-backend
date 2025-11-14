import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { SellerResponseDto } from '../dto/seller-response.dto';
import { MarkHelpfulDto } from '../dto/mark-helpful.dto';
import { ReportReviewDto } from '../dto/report-review.dto';
import { ModerateReviewDto } from '../dto/moderate-review.dto';
import { QueryReviewsDto, ReviewSortBy, ReviewStatusFilter } from '../dto/query-reviews.dto';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ProductsReviewService {
  private readonly logger = new Logger(ProductsReviewService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova avaliação
   */
  async create(dto: CreateReviewDto, userId: string) {
    // Verificar se produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se usuário já avaliou este produto
    const existingReview = await this.prisma.productReview.findFirst({
      where: {
        productId: dto.productId,
        userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('Você já avaliou este produto');
    }

    // Verificar se é compra verificada (se orderId fornecido)
    let isVerifiedPurchase = false;
    if (dto.orderId) {
      const order = await this.prisma.order.findFirst({
        where: {
          id: dto.orderId,
          userId,
          products: {
            some: {
              productId: dto.productId,
            },
          },
        },
      });

      if (order) {
        isVerifiedPurchase = true;
      } else {
        this.logger.warn(`Order ${dto.orderId} not found or doesn't contain product ${dto.productId}`);
      }
    }

    // Criar review
    const review = await this.prisma.productReview.create({
      data: {
        productId: dto.productId,
        userId,
        orderId: dto.orderId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        images: dto.images || [],
        isVerifiedPurchase,
        status: ReviewStatus.PENDING, // Moderação
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Atualizar estatísticas do produto (async)
    this.updateProductStats(dto.productId).catch((error) => {
      this.logger.error(`Failed to update product stats: ${error.message}`);
    });

    return {
      review,
      message: 'Avaliação criada com sucesso. Aguardando moderação.',
    };
  }

  /**
   * Listar avaliações com filtros
   */
  async findAll(query: QueryReviewsDto) {
    const {
      productId,
      rating,
      status,
      verifiedPurchaseOnly,
      sortBy = ReviewSortBy.RECENT,
      page = 1,
      limit = 10,
      search,
    } = query;

    // Build where clause
    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (rating) {
      where.rating = rating;
    }

    if (status && status !== ReviewStatusFilter.ALL) {
      where.status = status;
    }

    if (verifiedPurchaseOnly) {
      where.isVerifiedPurchase = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case ReviewSortBy.RECENT:
        orderBy = { createdAt: 'desc' };
        break;
      case ReviewSortBy.HELPFUL:
        orderBy = { helpfulCount: 'desc' };
        break;
      case ReviewSortBy.RATING_HIGH:
        orderBy = { rating: 'desc' };
        break;
      case ReviewSortBy.RATING_LOW:
        orderBy = { rating: 'asc' };
        break;
    }

    // Paginação
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          sellerResponder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.productReview.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar avaliação por ID
   */
  async findOne(id: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        sellerResponder: {
          select: {
            id: true,
            name: true,
          },
        },
        helpfulVotes: {
          select: {
            id: true,
            userId: true,
            isHelpful: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  /**
   * Atualizar avaliação (apenas o autor)
   */
  async update(id: string, dto: UpdateReviewDto, userId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar esta avaliação');
    }

    const updated = await this.prisma.productReview.update({
      where: { id },
      data: {
        ...dto,
        editedAt: new Date(),
        status: ReviewStatus.PENDING, // Reenviar para moderação após edição
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Atualizar stats do produto
    this.updateProductStats(review.productId).catch((error) => {
      this.logger.error(`Failed to update product stats: ${error.message}`);
    });

    return {
      review: updated,
      message: 'Avaliação atualizada com sucesso',
    };
  }

  /**
   * Deletar avaliação (apenas o autor ou admin)
   */
  async remove(id: string, userId: string, isAdmin: boolean = false) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta avaliação');
    }

    await this.prisma.productReview.delete({
      where: { id },
    });

    // Atualizar stats do produto
    this.updateProductStats(review.productId).catch((error) => {
      this.logger.error(`Failed to update product stats: ${error.message}`);
    });

    return {
      message: 'Avaliação deletada com sucesso',
    };
  }

  /**
   * Responder avaliação (seller/admin)
   */
  async addSellerResponse(id: string, dto: SellerResponseDto, userId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar se usuário é dono do produto ou admin
    // (Aqui você pode adicionar lógica mais complexa de verificação)

    const updated = await this.prisma.productReview.update({
      where: { id },
      data: {
        sellerResponse: dto.response,
        sellerRespondedAt: new Date(),
        sellerResponderId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        sellerResponder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      review: updated,
      message: 'Resposta adicionada com sucesso',
    };
  }

  /**
   * Marcar como útil/não útil
   */
  async markHelpful(reviewId: string, dto: MarkHelpfulDto, userId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar se usuário já votou
    const existingVote = await this.prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Atualizar voto se mudou
      if (existingVote.isHelpful !== dto.isHelpful) {
        await this.prisma.reviewHelpfulVote.update({
          where: {
            reviewId_userId: {
              reviewId,
              userId,
            },
          },
          data: {
            isHelpful: dto.isHelpful,
          },
        });

        // Atualizar contadores
        await this.updateHelpfulCounts(reviewId);
      }
    } else {
      // Criar novo voto
      await this.prisma.reviewHelpfulVote.create({
        data: {
          userId,
          reviewId,
          isHelpful: dto.isHelpful,
        },
      });

      // Atualizar contadores
      await this.updateHelpfulCounts(reviewId);
    }

    return {
      message: 'Voto registrado com sucesso',
    };
  }

  /**
   * Reportar avaliação
   */
  async report(id: string, dto: ReportReviewDto, userId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    await this.prisma.productReview.update({
      where: { id },
      data: {
        reportedCount: { increment: 1 },
        reportedReasons: {
          push: `${userId}: ${dto.reason}`,
        },
      },
    });

    this.logger.warn(`Review ${id} reported by user ${userId}: ${dto.reason}`);

    return {
      message: 'Denúncia registrada com sucesso',
    };
  }

  /**
   * Moderar avaliação (admin)
   */
  async moderate(id: string, dto: ModerateReviewDto, moderatorId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    await this.prisma.productReview.update({
      where: { id },
      data: {
        status: dto.status as ReviewStatus,
      },
    });

    this.logger.log(
      `Review ${id} moderated by ${moderatorId}: ${dto.status} ${dto.reason ? `- ${dto.reason}` : ''}`,
    );

    // Atualizar stats do produto se aprovado ou rejeitado
    if (dto.status !== 'PENDING') {
      this.updateProductStats(review.productId).catch((error) => {
        this.logger.error(`Failed to update product stats: ${error.message}`);
      });
    }

    return {
      message: 'Avaliação moderada com sucesso',
    };
  }

  /**
   * Obter estatísticas de avaliações de um produto
   */
  async getProductStats(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const [total, averageRating, ratingDistribution] = await Promise.all([
      this.prisma.productReview.count({
        where: {
          productId,
          status: ReviewStatus.APPROVED,
        },
      }),
      this.prisma.productReview.aggregate({
        where: {
          productId,
          status: ReviewStatus.APPROVED,
        },
        _avg: {
          rating: true,
        },
      }),
      this.prisma.productReview.groupBy({
        by: ['rating'],
        where: {
          productId,
          status: ReviewStatus.APPROVED,
        },
        _count: true,
      }),
    ]);

    // Formatar distribuição de ratings
    const distribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = ratingDistribution.find((r) => r.rating === rating);
      return {
        rating,
        count: found?._count || 0,
        percentage: total > 0 ? ((found?._count || 0) / total) * 100 : 0,
      };
    });

    return {
      total,
      averageRating: averageRating._avg.rating || 0,
      distribution,
      verifiedPurchases: await this.prisma.productReview.count({
        where: {
          productId,
          status: ReviewStatus.APPROVED,
          isVerifiedPurchase: true,
        },
      }),
    };
  }

  // ====== MÉTODOS AUXILIARES PRIVADOS ======

  /**
   * Atualizar contadores de helpful/not helpful
   */
  private async updateHelpfulCounts(reviewId: string) {
    const [helpful, notHelpful] = await Promise.all([
      this.prisma.reviewHelpfulVote.count({
        where: { reviewId, isHelpful: true },
      }),
      this.prisma.reviewHelpfulVote.count({
        where: { reviewId, isHelpful: false },
      }),
    ]);

    await this.prisma.productReview.update({
      where: { id: reviewId },
      data: {
        helpfulCount: helpful,
        notHelpfulCount: notHelpful,
      },
    });
  }

  /**
   * Atualizar estatísticas do produto (average rating e review count)
   */
  private async updateProductStats(productId: string) {
    const [reviewCount, averageRating] = await Promise.all([
      this.prisma.productReview.count({
        where: {
          productId,
          status: ReviewStatus.APPROVED,
        },
      }),
      this.prisma.productReview.aggregate({
        where: {
          productId,
          status: ReviewStatus.APPROVED,
        },
        _avg: {
          rating: true,
        },
      }),
    ]);

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount,
        averageRating: averageRating._avg.rating || 0,
      },
    });

    this.logger.log(`Product ${productId} stats updated: ${reviewCount} reviews, ${averageRating._avg.rating?.toFixed(2)} avg rating`);
  }
}

