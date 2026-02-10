/**
 * Tipos compartilhados para Order
 */

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'READY_FOR_MONTINK'
  | 'SENT_TO_MONTINK'
  | 'FAILED_MONTINK'
  | 'CANCELED'
  | 'FAILED'
  | 'REFUNDED';

export interface OrderTotals {
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  total: number;
}

export interface OrderShipping {
  cep: string | null;
  address1: string | null;
  number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  complement: string | null;
  service: string | null;
  deadline: number | null;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  size: string | null;
  color: string | null;
  name: string | null;
}

export interface OrderResponse {
  orderId: string;
  externalReference: string;
  status: OrderStatus;
  totals: OrderTotals;
  shipping: OrderShipping;
  items: OrderItem[];
  mpStatus: string | null;
  mpPaymentId: string | null;
  montinkStatus: string | null;
  montinkOrderId: string | null;
   payerEmailMasked: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Traduz status para linguagem humana
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Aguardando confirmação do pagamento',
    PAID: 'Pagamento aprovado',
    READY_FOR_MONTINK: 'Pagamento aprovado: produção será iniciada',
    SENT_TO_MONTINK: 'Em produção/envio',
    FAILED_MONTINK: 'Precisamos de suporte',
    CANCELED: 'Pedido cancelado',
    FAILED: 'Falha no pagamento',
    REFUNDED: 'Pedido reembolsado',
  };
  return labels[status] || status;
}
