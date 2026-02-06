/**
 * ⚠️ DEPRECATED - NÃO USAR NO FRONTEND
 * 
 * Este arquivo foi mantido apenas para referência do backend.
 * 
 * O frontend deve usar APENAS o Mercado Pago React SDK oficial:
 * - @mercadopago/sdk-react
 * - Componentes: Payment Brick, Wallet Brick
 * 
 * Para funções de backend, use: src/services/mercadopago-backend.ts
 * 
 * Documentação: https://github.com/mercadopago/sdk-react
 */

import type {
  MercadoPagoPaymentRequest,
  MercadoPagoPaymentResponse,
  MercadoPagoError,
  MercadoPagoItem,
} from '@/types/mercadopago';
import type { CartItem } from '@/types';

const MERCADOPAGO_API_BASE = 'https://api.mercadopago.com/v1';

/**
 * Obtém o Access Token do Mercado Pago das variáveis de ambiente
 */
function getAccessToken(): string {
  const token = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error(
      'VITE_MERCADOPAGO_ACCESS_TOKEN não está configurado. ' +
      'Por favor, adicione a variável no arquivo .env'
    );
  }
  
  return token;
}

/**
 * Cria o header de autorização para requisições ao Mercado Pago
 */
function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Converte itens do carrinho para o formato do Mercado Pago
 */
function convertCartItemsToMercadoPagoItems(
  items: CartItem[]
): MercadoPagoItem[] {
  return items.map((item) => ({
    id: item.product.id,
    title: `${item.product.name} - ${item.size} - ${item.color}`,
    description: item.product.description,
    picture_url: item.product.image.startsWith('/')
      ? `${window.location.origin}${item.product.image}`
      : item.product.image,
    category_id: item.product.category,
    quantity: item.quantity,
    unit_price: item.product.price,
  }));
}

/**
 * Interface para configuração completa de pagamento
 */
export interface CreatePaymentOptions {
  items: CartItem[];
  payerName?: string;
  payerEmail: string;
  payerPhone?: string;
  payerZipCode?: string;
  payerAddress?: string;
  payerIdentification?: {
    type: string;
    number: string;
  };
  statementDescriptor?: string; // Máximo 22 caracteres - aparece na fatura do cartão
  externalReference?: string; // ID único do pedido interno
  notificationUrl?: string; // URL do webhook
  backUrls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  binaryMode?: boolean; // Aprovação instantânea (aprovado ou rejeitado)
  dateOfExpiration?: string; // Para pagamentos offline (ISO 8601)
  maxInstallments?: number; // Número máximo de parcelas
  excludedPaymentMethods?: Array<{ id: string }>;
  excludedPaymentTypes?: Array<{ id: string }>;
  shipmentAmount?: number; // Valor do frete
}

/**
 * Cria um pagamento no Mercado Pago
 * 
 * @param paymentData - Dados do pagamento
 * @returns Promise com a resposta do pagamento
 */
export async function createPayment(
  paymentData: Omit<MercadoPagoPaymentRequest, 'additional_info' | 'metadata'> & CreatePaymentOptions
): Promise<MercadoPagoPaymentResponse> {
  const {
    items,
    payerName,
    payerEmail,
    payerPhone,
    payerZipCode,
    payerAddress,
    payerIdentification,
    statementDescriptor,
    externalReference,
    notificationUrl,
    backUrls,
    binaryMode,
    dateOfExpiration,
    maxInstallments,
    excludedPaymentMethods,
    excludedPaymentTypes,
    shipmentAmount,
    ...rest
  } = paymentData;

  const mercadoPagoItems = convertCartItemsToMercadoPagoItems(items);

  // Gera external_reference se não fornecido
  const finalExternalReference = externalReference || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const requestBody: MercadoPagoPaymentRequest & {
    statement_descriptor?: string;
    external_reference?: string;
    notification_url?: string;
    back_urls?: {
      success?: string;
      failure?: string;
      pending?: string;
    };
    binary_mode?: boolean;
    date_of_expiration?: string;
    installments?: number;
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    shipment?: {
      cost?: number;
    };
  } = {
    ...rest,
    payer: {
      email: payerEmail,
      ...(payerIdentification && {
        identification: payerIdentification,
      }),
    },
    additional_info: {
      items: mercadoPagoItems,
      ...(payerName && {
        payer: {
          first_name: payerName.split(' ')[0] || payerName,
          last_name: payerName.split(' ').slice(1).join(' ') || '',
          ...(payerPhone && {
            phone: {
              number: payerPhone.replace(/\D/g, ''),
            },
          }),
          ...(payerZipCode && {
            address: {
              zip_code: payerZipCode.replace(/\D/g, ''),
              ...(payerAddress && {
                street_name: payerAddress,
              }),
            },
          }),
        },
      }),
    },
    metadata: {
      order_id: finalExternalReference,
      items_count: items.length,
      platform: 'BRAVOS_BRASIL',
    },
    // Campos recomendados pela checklist de qualidade
    ...(statementDescriptor && {
      statement_descriptor: statementDescriptor.substring(0, 22), // Máximo 22 caracteres
    }),
    ...(finalExternalReference && {
      external_reference: finalExternalReference,
    }),
    ...(notificationUrl && {
      notification_url: notificationUrl,
    }),
    ...(backUrls && {
      back_urls: backUrls,
    }),
    ...(binaryMode !== undefined && {
      binary_mode: binaryMode,
    }),
    ...(dateOfExpiration && {
      date_of_expiration: dateOfExpiration,
    }),
    ...(maxInstallments && {
      installments: maxInstallments,
    }),
    ...(excludedPaymentMethods && excludedPaymentMethods.length > 0 && {
      excluded_payment_methods: excludedPaymentMethods,
    }),
    ...(excludedPaymentTypes && excludedPaymentTypes.length > 0 && {
      excluded_payment_types: excludedPaymentTypes,
    }),
    ...(shipmentAmount !== undefined && {
      shipment: {
        cost: shipmentAmount,
      },
    }),
  };

  try {
    const response = await fetch(`${MERCADOPAGO_API_BASE}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
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
 * @param paymentId - ID do pagamento
 * @returns Promise com os dados do pagamento
 */
export async function getPayment(paymentId: number): Promise<MercadoPagoPaymentResponse> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_BASE}/payments/${paymentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
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

/**
 * Valida se o Access Token está configurado
 */
export function validateAccessToken(): boolean {
  try {
    getAccessToken();
    return true;
  } catch {
    return false;
  }
}
