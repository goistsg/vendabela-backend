import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';

export interface PixPaymentData {
  qrCode: string;
  pixPayload: string;
}

@Injectable()
export class PaymentGeneratorService {
  /**
   * Gera QR Code e PIX Payload simulados para pagamentos PIX
   * @param orderId ID do pedido
   * @param amount Valor total do pedido
   * @returns Objeto com qrCode e pixPayload
   */
  generatePixPayment(orderId: string, amount: number): PixPaymentData {
    // Simulação: em produção, aqui você integraria com APIs de pagamento reais
    // como Mercado Pago, PagSeguro, Cielo, etc.
    
    const timestamp = new Date().getTime();
    const randomCode = Math.random().toString(36).substring(2, 15);
    
    // Simulação de PIX Payload (formato simplificado)
    const pixPayload = this.generatePixPayloadSimulation(orderId, amount, randomCode);
    
    // Simulação de QR Code (normalmente seria uma imagem base64 ou URL)
    const qrCode = this.generateQrCodeSimulation(pixPayload, timestamp);
    
    return {
      qrCode,
      pixPayload,
    };
  }

  /**
   * Gera payload PIX simulado
   */
  private generatePixPayloadSimulation(orderId: string, amount: number, code: string): string {
    // Formato simplificado do PIX (na prática seria EMV/QRCode padrão do Bacen)
    const payloadData = {
      version: '01',
      merchantAccountInfo: '00020126580014br.gov.bcb.pix',
      merchantName: 'VENDABELA',
      merchantCity: 'SAO PAULO',
      transactionAmount: amount.toFixed(2),
      transactionId: orderId,
      additionalInfo: code,
    };
    
    // Serializa como string simulada (não é o formato real do PIX)
    return `${payloadData.version}${payloadData.merchantAccountInfo}${payloadData.merchantName}${payloadData.merchantCity}${payloadData.transactionAmount}${payloadData.transactionId}${payloadData.additionalInfo}`;
  }

  /**
   * Gera QR Code simulado
   */
  private generateQrCodeSimulation(payload: string, timestamp: number): string {
    // Em produção, você usaria uma biblioteca como qrcode ou integraria com API
    // Aqui retornamos uma string simulada que representaria a imagem
    const hash = Buffer.from(`${payload}-${timestamp}`).toString('base64');
    return `data:image/png;base64,SIMULATED_QR_CODE_${hash}`;
  }

  /**
   * Valida se o método de pagamento requer geração de dados adicionais
   * @param method Método de pagamento
   * @returns true se requer geração de dados (PIX), false caso contrário
   */
  requiresPaymentGeneration(method: PaymentMethod): boolean {
    return method === PaymentMethod.PIX;
  }

  /**
   * Gera dados de pagamento de acordo com o método escolhido
   * @param method Método de pagamento
   * @param orderId ID do pedido
   * @param amount Valor total
   * @returns Dados do pagamento ou null se não for necessário
   */
  generatePaymentData(method: PaymentMethod, orderId: string, amount: number): PixPaymentData | null {
    if (method === PaymentMethod.PIX) {
      return this.generatePixPayment(orderId, amount);
    }
    
    // Outros métodos de pagamento não precisam de geração automática
    return null;
  }
}

