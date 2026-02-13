/**
 * Provider do Mercado Pago React SDK
 * 
 * Este componente inicializa o SDK do Mercado Pago uma única vez
 * na aplicação. O initMercadoPago deve ser chamado apenas uma vez.
 * 
 * Documentação oficial: https://github.com/mercadopago/sdk-react
 */

import { initMercadoPago } from '@mercadopago/sdk-react';
import { useEffect } from 'react';

interface MercadoPagoProviderProps {
  children: React.ReactNode;
}

export function MercadoPagoProvider({ children }: MercadoPagoProviderProps) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('MercadoPagoProvider - Inicializando SDK');
      console.log('🔑 MercadoPagoProvider - Todas as variáveis VITE_*:', 
        Object.keys(import.meta.env)
          .filter(key => key.startsWith('VITE_'))
          .reduce((obj, key) => {
            obj[key] = import.meta.env[key];
            return obj;
          }, {} as Record<string, any>)
      );
    }

    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

    if (import.meta.env.DEV) {
      console.log('🔑 MercadoPagoProvider - Public Key (raw):', publicKey);
      console.log('🔑 MercadoPagoProvider - Public Key presente:', !!publicKey);
      console.log('🔑 MercadoPagoProvider - Public Key (primeiros 20 chars):', publicKey ? publicKey.substring(0, 20) + '...' : 'NÃO CONFIGURADA');
      console.log('🔑 MercadoPagoProvider - Public Key (completa):', publicKey || 'NÃO CONFIGURADA');
    }

    if (!publicKey) {
      console.error(
        '❌ VITE_MERCADOPAGO_PUBLIC_KEY não está configurado. ' +
        'Adicione a Public Key no arquivo .env'
      );
      return;
    }

    try {
      if (import.meta.env.DEV) console.log('MercadoPagoProvider - Chamando initMercadoPago...');
      // Inicializa o SDK do Mercado Pago
      // Deve ser chamado apenas uma vez na aplicação
      initMercadoPago(publicKey, {
        locale: 'pt-BR',
      });
      if (import.meta.env.DEV) console.log('✅ MercadoPagoProvider - SDK inicializado com sucesso');
    } catch (error) {
      console.error('❌ MercadoPagoProvider - Erro ao inicializar Mercado Pago SDK:', error);
    }
  }, []);

  return <>{children}</>;
}
