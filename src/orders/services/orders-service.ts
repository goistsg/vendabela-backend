import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddressService } from '../../address/services/address-service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CartCheckoutDto } from 'orders/dto/cart-checkout.dto';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private addressService: AddressService,
  ) {}

  async calculateTotal(products: {price: number, quantity: number}[], discount: number = 0) {
    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0) - discount;
    return total;
  }

  async create(dto: CreateOrderDto, userId?: string) {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar pedidos`);
    }

    const total = await this.calculateTotal(dto.products, dto.discount);

    return this.prisma.order.create({
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
  }

  async createOrderFromCart(cart: Cart & { items: CartItem[] }, addressNumber: string, userId?: string): Promise<CreateOrderDto> {
    if (!userId) {
      throw new NotFoundException(`userId é obrigatório para criar pedidos`);
    }

    const products = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    const total = await this.calculateTotal(products, cart.discountValue);

    // Usa o serviço de endereço para buscar ou criar o endereço
    const address = await this.addressService.findOrCreateByZipCode(cart.cep, addressNumber, userId);

    return {
      userId: userId,
      clientId: cart.userId,
      companyId: cart.companyId,
      addressId: address.id,
      discount: cart.discountValue,
      total: total,
      products: products,
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

    const orderDto = await this.createOrderFromCart(cart, dto.addressNumber, userId);

    return this.create(orderDto, userId);
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

    const total = await this.calculateTotal(dto.products || order.products, dto.discount || order.discount);

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
