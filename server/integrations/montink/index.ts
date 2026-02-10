/**
 * Barrel export para integração Montink
 * 
 * Exporta client e types para uso em outras partes do backend
 */

export { montinkRequest } from './client';
export type {
  MontinkProduct,
  MontinkShippingQuote,
  MontinkOrderRequest,
  MontinkOrderResponse,
} from './types';

export { getMontinkShippingQuote } from './shipping';
export type {
  MontinkShippingQuoteParams,
  MontinkShippingOption,
} from './shipping';

export { mapOrderToMontinkPayload } from './mappers';

export { getMontinkOrder, listMontinkProducts, createMontinkOrder } from './orders';
