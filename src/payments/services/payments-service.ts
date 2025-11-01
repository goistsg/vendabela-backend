import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${dto.orderId} não encontrado`);
    }

    // Verificar se já existe um pagamento para este pedido
    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId: dto.orderId },
    });

    if (existingPayment) {
      throw new ConflictException(`Já existe um pagamento para o pedido ${dto.orderId}`);
    }

    return this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        method: dto.method,
        qrCode: dto.qrCode,
        pixPayload: dto.pixPayload,
        status: PaymentStatus.PENDING,
      },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByOrderId(orderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Pagamento para o pedido ${orderId} não encontrado`);
    }

    return payment;
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }

    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto) {
    // Verificar se o pagamento existe
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        qrCode: dto.qrCode,
        pixPayload: dto.pixPayload,
      },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: PaymentStatus) {
    // Verificar se o pagamento existe
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Verificar se o pagamento existe
    await this.findOne(id);

    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async findByStatus(status: PaymentStatus) {
    return this.prisma.payment.findMany({
      where: { status },
      include: {
        order: {
          include: {
            user: true,
            client: true,
            company: true,
            address: true,
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}