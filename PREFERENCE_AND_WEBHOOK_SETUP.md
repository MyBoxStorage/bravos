# Configuração de Preferências de Pagamento e Webhooks - Mercado Pago

## ✅ Implementação Completa

### 1. Preferências de Pagamento

#### Backend (`server/routes/mp/create-preference.ts`)
- ✅ Endpoint: `POST /api/mp/create-preference`
- ✅ Cria preferências de pagamento no Mercado Pago
- ✅ Suporta múltiplos itens, dados do pagador, frete
- ✅ Configura URLs de retorno (success, failure, pending)
- ✅ Configura webhook de notificações
- ✅ Expiração automática (24 horas)
- ✅ Suporte a parcelas (até 12x)

#### Frontend (`src/services/mercadopago-preference.ts`)
- ✅ Serviço para criar preferências via backend
- ✅ Funções auxiliares para redirecionamento
- ✅ Suporte para web e mobile

#### Componente (`src/components/PaymentBrickWithPreference.tsx`)
- ✅ Usa preferências ao invés de initialization direta
- ✅ Mais seguro (Access Token no backend)
- ✅ Loading states e tratamento de erros
- ✅ Integrado com CheckoutWithBrick

### 2. Webhooks

#### Handler (`server/routes/mp/webhooks.ts`)
- ✅ Endpoint: `POST /api/mp/webhooks`
- ✅ Processa notificações de pagamento (`payment`)
- ✅ Processa notificações de pedido (`merchant_order`)
- ✅ Idempotência (evita processamento duplicado)
- ✅ Atualiza status do pedido no banco de dados
- ✅ Mapeamento de status do MP para status interno

### 3. Integração Web e Mobile

#### Web
- ✅ Payment Brick com preferências
- ✅ Redirecionamento automático após pagamento
- ✅ URLs de retorno configuradas

#### Mobile
- ✅ Deep links configurados
- ✅ URLs específicas para Android e iOS
- ✅ Detecção automática do dispositivo

## 📋 Configuração Necessária

### Variáveis de Ambiente

#### Backend (`.env` ou `server/.env`)
```env
MP_ACCESS_TOKEN=seu_access_token_aqui
FRONTEND_URL=https://bravosbrasil.com.br
BACKEND_URL=https://api.bravosbrasil.com.br
```

#### Frontend (`.env`)
```env
VITE_MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
VITE_BACKEND_URL=https://api.bravosbrasil.com.br
```

### Banco de Dados

Execute a migration para adicionar o campo `mpPreferenceId`:

```bash
cd server
npx prisma migrate dev --name add_mp_preference_id
```

## 🔧 Como Usar

### 1. Criar Preferência de Pagamento

```typescript
import { createPreference } from '@/services/mercadopago-preference';

const preference = await createPreference({
  items: cart.items,
  payer: {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    zipCode: '01310-100',
    address: 'Av. Paulista, 1000',
  },
  amount: 299.90,
  shipping: 15.00,
});
```

### 2. Usar Payment Brick com Preferência

```tsx
<PaymentBrickWithPreference
  amount={cart.total}
  items={cart.items}
  payerEmail="cliente@example.com"
  payerName="Cliente"
  shipping={cart.shipping}
  onReady={() => console.log('Brick pronto!')}
  onSubmit={async (data) => {
    console.log('Pagamento processado:', data);
  }}
  onError={(error) => console.error('Erro:', error)}
/>
```

### 3. Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em "Webhooks"
3. Adicione a URL: `https://api.bravosbrasil.com.br/api/mp/webhooks`
4. Selecione os eventos:
   - `payment`
   - `merchant_order`

## 📊 Fluxo Completo

1. **Cliente preenche dados** → CheckoutWithBrick
2. **Sistema cria preferência** → Backend cria preferência no MP
3. **Payment Brick renderiza** → Usa `preferenceId` para carregar métodos
4. **Cliente seleciona método** → PIX, Cartão, Boleto, etc.
5. **Pagamento processado** → Mercado Pago processa
6. **Webhook recebe notificação** → Backend atualiza status do pedido
7. **Cliente é redirecionado** → Página de sucesso/falha/pendente

## 🔒 Segurança

- ✅ Access Token apenas no backend
- ✅ Public Key no frontend (seguro)
- ✅ Validação de dados no backend
- ✅ Idempotência nos webhooks
- ✅ Logs de todas as operações

## 📝 Status de Pagamento

| Mercado Pago | Status Interno | Descrição |
|--------------|----------------|-----------|
| `approved` | `PAID` | Pagamento aprovado |
| `pending` | `PENDING` | Aguardando confirmação |
| `in_process` | `PENDING` | Em processamento |
| `rejected` | `CANCELED` | Pagamento rejeitado |
| `cancelled` | `CANCELED` | Cancelado |
| `refunded` | `REFUNDED` | Reembolsado |
| `charged_back` | `REFUNDED` | Chargeback |

## 🚀 Próximos Passos

1. ✅ Executar migration do Prisma
2. ✅ Configurar variáveis de ambiente
3. ✅ Configurar webhook no painel do Mercado Pago
4. ✅ Testar fluxo completo
5. ✅ Monitorar logs do webhook

## 📚 Documentação

- [Mercado Pago - Preferências](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/preferences)
- [Mercado Pago - Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Mercado Pago - Payment Brick](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick)
