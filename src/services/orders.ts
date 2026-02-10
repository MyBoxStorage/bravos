/**
 * Serviço para consultar pedidos
 */

import { getJSON } from './api';
import type { OrderResponse } from '@/types/order';

/**
 * Consulta um pedido por externalReference + email (para validação no backend)
 */
export async function getOrder(externalReference: string, email?: string): Promise<OrderResponse> {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  return getJSON<OrderResponse>(`/api/orders/${externalReference}${query}`);
}
