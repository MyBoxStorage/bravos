# Configuração Frontend: Web e Mobile - Mercado Pago

## ✅ Implementação Completa

### 1. Detecção de Dispositivo

#### Utilitário (`src/utils/device-detection.ts`)
- ✅ `isMobileDevice()` - Detecta dispositivos móveis
- ✅ `isTabletDevice()` - Detecta tablets
- ✅ `getPlatform()` - Retorna 'ios', 'android' ou 'web'
- ✅ `shouldUseRedirect()` - Decide se deve redirecionar (mobile) ou usar Brick (web)
- ✅ `getDeviceInfo()` - Retorna informações completas do dispositivo

#### Hook (`src/hooks/useDevice.ts`)
- ✅ `useDevice()` - Hook React para informações do dispositivo
- ✅ `useIsMobile()` - Hook simplificado para verificar mobile
- ✅ `usePlatform()` - Hook para obter a plataforma

### 2. Checkout Adaptativo

#### Componente (`src/components/AdaptiveCheckout.tsx`)
- ✅ Detecta automaticamente o dispositivo
- ✅ **Web**: Usa Payment Brick (embedded)
- ✅ **Mobile**: Redireciona para checkout do Mercado Pago
- ✅ Cria preferência automaticamente
- ✅ Suporta deep links para apps

### 3. Integração Web

#### Payment Brick com Preferências
```tsx
<AdaptiveCheckout
  amount={cart.total}
  items={cart.items}
  payerEmail="cliente@example.com"
  payerName="Cliente"
  shipping={15.00}
/>
```

**Características:**
- ✅ Payment Brick embedded na página
- ✅ Múltiplos métodos de pagamento (cartão, PIX, boleto)
- ✅ Validação em tempo real
- ✅ Experiência fluida sem sair do site

### 4. Integração Mobile

#### Redirecionamento Inteligente
```tsx
// Mobile detectado automaticamente
// Redireciona para checkout do Mercado Pago
// Abre no app se instalado, senão no navegador
```

**Características:**
- ✅ Detecção automática de iOS/Android
- ✅ Deep links para apps
- ✅ Fallback para navegador se app não instalado
- ✅ Botão de checkout otimizado para mobile

### 5. Serviços de Preferências

#### Funções Disponíveis (`src/services/mercadopago-preference.ts`)
- ✅ `createPreference()` - Cria preferência via backend
- ✅ `redirectToCheckout()` - Redireciona para checkout (web)
- ✅ `openCheckoutInNewTab()` - Abre checkout em nova aba
- ✅ `getMobileCheckoutUrl()` - URL para mobile
- ✅ `openMobileCheckout()` - Abre no app do Mercado Pago

## 📱 Fluxo Mobile

1. **Cliente preenche dados** → CheckoutWithBrick
2. **Sistema detecta mobile** → AdaptiveCheckout
3. **Cria preferência** → Backend cria preferência no MP
4. **Botão "Ir para o Pagamento"** → Cliente clica
5. **Redirecionamento** → Mercado Pago (app ou navegador)
6. **Pagamento processado** → Webhook atualiza status
7. **Retorno** → Página de sucesso/falha/pendente

## 💻 Fluxo Web

1. **Cliente preenche dados** → CheckoutWithBrick
2. **Sistema detecta web** → AdaptiveCheckout
3. **Cria preferência** → Backend cria preferência no MP
4. **Payment Brick renderiza** → Métodos de pagamento aparecem
5. **Cliente seleciona método** → PIX, Cartão, Boleto, etc.
6. **Pagamento processado** → Webhook atualiza status
7. **Callback onSubmit** → Redireciona para página de resultado

## 🔧 Configuração

### Variáveis de Ambiente

#### Frontend (`.env`)
```env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_BACKEND_URL=https://api.bravosbrasil.com.br
```

### Backend

O backend já está configurado para retornar:
- `initPoint` - URL para web
- `mobile.android` - URL para Android
- `mobile.ios` - URL para iOS

## 📊 Detecção de Dispositivo

### Web
- Desktop/Laptop
- Tablet (alguns casos)
- **Estratégia**: Payment Brick embedded

### Mobile
- Smartphones iOS
- Smartphones Android
- Tablets (maioria)
- **Estratégia**: Redirecionamento para checkout

## 🎯 Exemplo de Uso

```tsx
import { AdaptiveCheckout } from '@/components/AdaptiveCheckout';

function CheckoutPage() {
  return (
    <AdaptiveCheckout
      amount={299.90}
      items={cartItems}
      payerEmail="cliente@example.com"
      payerName="João Silva"
      payerPhone="(11) 99999-9999"
      shipping={15.00}
      onReady={() => console.log('Checkout pronto!')}
      onSubmit={async (data) => {
        console.log('Pagamento:', data);
        // Redirecionar ou atualizar UI
      }}
      onError={(error) => {
        console.error('Erro:', error);
      }}
    />
  );
}
```

## 🔍 Debug

### Verificar Detecção de Dispositivo
```typescript
import { getDeviceInfo } from '@/utils/device-detection';

const device = getDeviceInfo();
console.log('Device Info:', device);
// {
//   isMobile: true/false,
//   isTablet: true/false,
//   platform: 'ios' | 'android' | 'web',
//   shouldUseRedirect: true/false
// }
```

### Verificar no Console
- Abra o console do navegador (F12)
- Procure por logs:
  - `AdaptiveCheckout - Criando preferência...`
  - `AdaptiveCheckout - Preferência criada:`
  - `AdaptiveCheckout - Redirecionando para checkout...`

## 📱 Deep Links

### iOS
- Tenta abrir: `mercadopago://checkout?preference_id=...`
- Fallback: URL do checkout no navegador

### Android
- Tenta abrir: Intent do Mercado Pago
- Fallback: URL do checkout no navegador

## ✅ Vantagens da Implementação

1. **Experiência Otimizada**
   - Web: Payment Brick embedded (sem sair do site)
   - Mobile: App nativo do Mercado Pago (melhor UX)

2. **Detecção Automática**
   - Não precisa configurar manualmente
   - Funciona em todos os dispositivos

3. **Segurança**
   - Access Token apenas no backend
   - Preferências criadas de forma segura

4. **Flexibilidade**
   - Fácil de customizar
   - Suporta todos os métodos de pagamento

## 🚀 Próximos Passos

1. ✅ Testar em dispositivos reais (iOS e Android)
2. ✅ Verificar deep links funcionando
3. ✅ Testar fallback para navegador
4. ✅ Monitorar logs de preferências
5. ⚠️ (Opcional) Adicionar Wallet Brick para mobile

## 📚 Documentação

- [Mercado Pago - Payment Brick](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick)
- [Mercado Pago - Preferências](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/preferences)
- [Mercado Pago - Mobile](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/mobile)
