/**
 * Serviço de Backend para Mercado Pago
 * 
 * Este arquivo contém funções que devem ser usadas APENAS no backend.
 * O frontend usa o SDK React oficial (@mercadopago/sdk-react).
 * 
 * IMPORTANTE: Access Token NUNCA deve ser exposto no frontend!
 */

import type {
  MercadoPagoPaymentRequest,
  MercadoPagoPaymentResponse,
  MercadoPagoError,
} from '@/types/mercadopago';

const MERCADOPAGO_API_BASE = 'https://api.mercadopago.com/v1';

/**
 * Cria o header de autorização para requisições ao Mercado Pago
 * 
 * ⚠️ USAR APENAS NO BACKEND
 * 
 * @param accessToken - Access Token do Mercado Pago
 * @returns Headers com autorização Bearer
 */
export function getAuthHeaders(accessToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Cria um pagamento no Mercado Pago via API
 * 
 * ⚠️ USAR APENAS NO BACKEND
 * 
 * @param accessToken - Access Token do Mercado Pago
 * @param paymentData - Dados do pagamento
 * @returns Promise com a resposta do pagamento
 */
export async function createPaymentBackend(
  accessToken: string,
  paymentData: MercadoPagoPaymentRequest
): Promise<MercadoPagoPaymentResponse> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_BASE}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as MercadoPagoError;
      throw new Error(
        error.message || `Erro ao processar pagamento: ${response.statusText}`
      );
    }

    return data as MercadoPagoPaymentResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao processar pagamento');
  }
}

/**
 * Consulta o status de um pagamento
 * 
 * ⚠️ USAR APENAS NO BACKEND
 * 
 * @param accessToken - Access Token do Mercado Pago
 * @param paymentId - ID do pagamento
 * @returns Promise com os dados do pagamento
 */
export async function getPaymentBackend(
  accessToken: string,
  paymentId: number
): Promise<MercadoPagoPaymentResponse> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_BASE}/payments/${paymentId}`, {
      method: 'GET',
      headers: getAuthHeaders(accessToken),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as MercadoPagoError;
      throw new Error(
        error.message || `Erro ao consultar pagamento: ${response.statusText}`
      );
    }

    return data as MercadoPagoPaymentResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao consultar pagamento');
  }
}
