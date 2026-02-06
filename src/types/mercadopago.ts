// Tipos para integração com Mercado Pago API

export interface MercadoPagoPaymentRequest {
  transaction_amount: number;
  token?: string;
  description: string;
  installments: number;
  payment_method_id: string;
  issuer_id?: number;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  metadata?: Record<string, any>;
  additional_info?: {
    items: MercadoPagoItem[];
    payer?: {
      first_name?: string;
      last_name?: string;
      phone?: {
        area_code?: string;
        number?: string;
      };
      address?: {
        zip_code?: string;
        street_name?: string;
        street_number?: number;
      };
    };
  };
}

export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
}

export interface MercadoPagoPaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  installments: number;
  payment_method_id: string;
  payment_type_id: string;
  date_created: string;
  date_approved?: string;
  payer: {
    id?: string;
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  metadata?: Record<string, any>;
}

export interface MercadoPagoError {
  error: string;
  message: string;
  cause?: Array<{
    code: string;
    description: string;
    data?: string;
  }>;
  status?: number;
}
