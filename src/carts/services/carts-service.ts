import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, Prisma } from '@prisma/client';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string, companyId: string) {
    if (!companyId) {
      throw new NotFoundException(`companyId é obrigatório para buscar carrinho`);
    }

    const whereClause = userId ? { userId, companyId } : { companyId };

    let cart = await this.prisma.cart.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        company: true
      }
    });

    if (!cart) {
      cart = await this.createCart(userId, companyId);
    }

    return cart;
  }

  async createCart(userId: string, companyId: string): Promise<any> {
    return this.prisma.cart.create({
      data: {
        userId: userId || null,
        companyId,
        sessionId: userId ? null : `session_${Date.now()}`, // Para usuários anônimos
      }
    });
  }

  async addToCart(userId: string, companyId: string, addToCartDto: AddToCartDto) {
    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId }
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.companyId !== companyId) {
      throw new BadRequestException('Produto não pertence à empresa especificada');
    }

    // Buscar ou criar carrinho
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId, companyId } : { companyId }
    });

    if (!cart) {
      cart = await this.createCart(userId, companyId);
    }

    // Verificar se o item já existe no carrinho
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId
      }
    });

    if (existingItem) {
      // Atualizar quantidade
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + addToCartDto.quantity
        },
        include: {
          product: true
        }
      });
    } else {
      // Adicionar novo item
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
          price: product.salePrice || product.lastPrice
        },
        include: {
          product: true
        }
      });
    }
  }

  async updateCartItem(userId: string, companyId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    // Verificar se o item pertence ao carrinho do usuário
    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId, companyId } : { companyId }
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    if (updateCartItemDto.quantity <= 0) {
      // Se quantidade for 0 ou negativa, remover o item
      return this.removeFromCart(userId, companyId, itemId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: updateCartItemDto.quantity
      },
      include: {
        product: true
      }
    });
  }

  async removeFromCart(userId: string, companyId: string, itemId: string) {
    // Verificar se o item pertence ao carrinho do usuário
    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId, companyId } : { companyId }
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId }
    });

    return {
      message: 'Item removido do carrinho com sucesso',
      itemId
    };
  }

  async clearCart(userId: string, companyId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId, companyId } : { companyId }
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    // Remover todos os itens do carrinho
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return {
      message: 'Carrinho limpo com sucesso',
      cartId: cart.id
    };
  }

  // Método adicional para calcular totais
  async getCartTotals(userId: string, companyId: string) {
    const cart = await this.getCart(userId, companyId);
    
    if (!cart) {
      return { subtotal: 0, total: 0, itemCount: 0 };
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cart.deliveryFee || 0;
    const discountValue = cart.discountValue || 0;
    const total = subtotal + deliveryFee - discountValue;

    return {
      subtotal,
      deliveryFee,
      discountValue,
      total,
      itemCount: cart.items.length
    };
  }
}