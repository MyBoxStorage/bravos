# Integração com Mercado Pago React SDK

Este projeto usa **APENAS** o Mercado Pago React SDK oficial como biblioteca de pagamento frontend.

## 📦 Instalação

O SDK já está instalado:

```bash
npm install @mercadopago/sdk-react
```

## 🔑 Configuração

### Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Public Key (usada no frontend)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook URL (opcional, para notificações)
VITE_MERCADOPAGO_WEBHOOK_URL=https://api.bravosbrasil.com.br/webhooks/mercadopago
```

### Como obter a Public Key

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione sua aplicação "Bravos Brasil Real"
3. Copie a **Public Key** (não confundir com Access Token)
4. Cole no arquivo `.env`

## 🏗️ Arquitetura

### Componentes Criados

1. **MercadoPagoProvider** (`src/components/MercadoPagoProvider.tsx`)
   - Inicializa o SDK do Mercado Pago
   - Fornece contexto para componentes filhos

2. **PaymentBrick** (`src/components/PaymentBrick.tsx`)
   - Componente que usa o Payment Brick oficial
   - Suporta múltiplos métodos de pagamento
   - Processa pagamentos automaticamente

3. **CheckoutWithBrick** (`src/components/CheckoutWithBrick.tsx`)
   - Componente de checkout completo
   - Usa PaymentBrick para processar pagamentos
   - Não faz chamadas diretas à API

### Fluxo de Pagamento

```
1. Cliente preenche dados pessoais
   ↓
2. Cliente clica em "Continuar para pagamento"
   ↓
3. Payment Brick é exibido
   ↓
4. Cliente seleciona método de pagamento
   ↓
5. Payment Brick processa o pagamento
   ↓
6. Callback onSuccess é chamado
```

## 📚 Documentação Oficial

- **Repositório**: https://github.com/mercadopago/sdk-react
- **Documentação**: https://www.mercadopago.com.br/developers/pt/docs
- **Payment Brick**: https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/introduction

## ✅ Regras de Implementação

### ✅ O que FAZER:

- ✅ Usar apenas componentes oficiais do SDK React
- ✅ Seguir a documentação oficial do repositório
- ✅ Usar Wallet e Bricks conforme documentação
- ✅ Configurar Public Key no `.env`

### ❌ O que NÃO FAZER:

- ❌ **Não fazer chamadas diretas à API** no frontend
- ❌ **Não usar props não documentados**
- ❌ **Não misturar com Checkout Pro iframe**
- ❌ **Não usar Access Token no frontend** (apenas no backend)
- ❌ **Não usar múltiplas bibliotecas de pagamento**

## 🔧 Uso do Payment Brick

O Payment Brick é inicializado com:

```typescript
<Payment
  initialization={{
    amount: 100.00,
    payer: {
      email: 'cliente@email.com',
    },
    items: [...],
    external_reference: 'ORDER-123',
    statement_descriptor: 'BRAVOS BRASIL',
    back_urls: {
      success: '...',
      failure: '...',
      pending: '...',
    },
  }}
  onSubmit={handleSubmit}
  onReady={handleReady}
  onError={handleError}
/>
```

## 🚀 Próximos Passos

1. ✅ SDK React instalado
2. ✅ Componentes criados
3. ⚠️ Configurar Public Key no `.env`
4. ⚠️ Testar integração em desenvolvimento
5. ⚠️ Configurar webhook no backend (opcional)

## 📝 Notas Importantes

- O **Access Token** deve ser usado **APENAS no backend**
- O **Public Key** é usado no frontend para inicializar o SDK
- O Payment Brick processa pagamentos automaticamente
- Não é necessário fazer chamadas à API no frontend
- O backend receberá notificações via webhook (se configurado)

## 🔒 Segurança

- ✅ Public Key é segura para uso no frontend
- ✅ Access Token NUNCA deve ser exposto no frontend
- ✅ Validação de pagamentos deve ser feita no backend
- ✅ Webhooks devem ser validados no backend
