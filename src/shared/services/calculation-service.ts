import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculationService {
  /**
   * Calcula o total de produtos considerando preço, quantidade e desconto
   * @param products Array de produtos com preço e quantidade
   * @param discount Valor do desconto a ser aplicado (padrão: 0)
   * @returns Total calculado
   */
  calculateTotal(products: {price: number, quantity: number}[], discount: number = 0): number {
    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const total = subtotal - discount;
    return total;
  }

  /**
   * Calcula o subtotal de produtos (sem desconto)
   * @param products Array de produtos com preço e quantidade
   * @returns Subtotal calculado
   */
  calculateSubtotal(products: {price: number, quantity: number}[]): number {
    return products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }
}

