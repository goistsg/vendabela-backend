import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculationService } from '../../shared/services/calculation-service';
import { PaymentGeneratorService } from '../../shared/services/payment-generator-service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CartCheckoutDto } from 'orders/dto/cart-checkout.dto';
import { Cart, CartItem, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private calculationService: CalculationService,
    private paymentGeneratorService: PaymentGeneratorService,
  ) {}

  async create(dto: CreateOrderDto, userId?: string) {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar pedidos`);
    }

    const total = this.calculationService.calculateTotal(dto.products, dto.discount);

    const order = await this.prisma.order.create({
      data: {
        userId: userId,
        clientId: dto.clientId,
        companyId: dto.companyId,
        addressId: dto.addressId,
        discount: dto.discount,
        total: total,
        products: {
          create: dto.products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          })),
        },
      },
      include: { 
        user: true,
        client: true,
        company: true,
        address: true,
        payments: true,
        products: {
          include: {
            product: true
          }
        }
      },
    });

    // Gerar dados de pagamento (QR Code e PIX Payload se for PIX)
    const paymentData = this.paymentGeneratorService.generatePaymentData(
      dto.paymentMethod,
      order.id,
      total
    );

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        method: dto.paymentMethod,
        qrCode: paymentData?.qrCode || null,
        pixPayload: paymentData?.pixPayload || null,
        status: PaymentStatus.PENDING,
      },
    });

    return { ...order, payments: [payment] };
  }

  async createOrderFromCart(cart: Cart & { items: CartItem[] }, addressId: string, paymentMethod: PaymentMethod, userId?: string): Promise<CreateOrderDto> {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar pedidos`);
    }

    const products = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    const total = this.calculationService.calculateTotal(products, cart.discountValue);

    return {
      userId: userId,
      clientId: cart.userId,
      companyId: cart.companyId,
      addressId: addressId,
      discount: cart.discountValue,
      total: total,
      products: products,
      paymentMethod: paymentMethod,
    } as CreateOrderDto;
  }

  async cartCheckout(dto: CartCheckoutDto, userId?: string) {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar pedidos`);
    }

    const cart = await this.prisma.cart.findUnique({
      where: { id: dto.cartId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${dto.cartId} não encontrado`);
    }

    const orderDto = await this.createOrderFromCart(cart, dto.addressId, dto.paymentMethod, userId);

    const order = await this.create(orderDto, userId);

    if (order) {
      try {
        await this.prisma.cart.delete({
          where: { id: cart.id },
        });
      } catch (error) {
        throw new InternalServerErrorException(`Erro ao deletar carrinho: ${error.message}`);
      }
    }

    return order;
  }

  async findAll(userId?: string) {   
    const whereClause = userId ? { userId } : {};

    return this.prisma.order.findMany({
      where: whereClause,
      include: { 
        user: true,
        client: true,
        company: true,
        address: true,
        products: {
          include: {
            product: true
          }
        }
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const whereClause: any = { id };
    
    if (userId) {
      whereClause.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where: whereClause,
      include: {
        user: true,
        client: true,
        company: true,
        address: true,
        payments: true,
        products: {
          include: {
            product: true,
          }
        }
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado ou você não tem permissão para acessá-lo`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto, userId?: string) {
    // Verificar se o pedido existe e se o usuário tem permissão
    const order = await this.findOne(id, userId);

    const total = this.calculationService.calculateTotal(dto.products || order.products, dto.discount || order.discount);

    return this.prisma.order.update({
      where: { id },
      data: {
        total: total,
        discount: dto.discount,
        status: dto.status,
        addressId: dto.addressId,
        clientId: dto.clientId,
        companyId: dto.companyId,
        // Não atualize os produtos diretamente aqui se for uma relação 1:N, isso deve ser feito separadamente
      },
      include: {
        user: true,
        client: true,
        company: true,
        address: true,
        products: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async remove(id: string, userId?: string) {
    // Verificar se o pedido existe e se o usuário tem permissão
    await this.findOne(id, userId);

    await this.prisma.orderProduct.deleteMany({
      where: { orderId: id, },
    });
    return this.prisma.order.delete({
      where: { id },
      include: {
        payments: {
          include: {
            order: true
          }
        }
      },
    });
  }
}
