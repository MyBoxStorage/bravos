# Configuração de Webhooks - Mercado Pago

## O que são Webhooks?

Webhooks são notificações em tempo real enviadas pelo Mercado Pago quando ocorrem eventos relacionados aos pagamentos (aprovação, rejeição, cancelamento, etc.).

## Por que são importantes?

- ✅ Atualização automática do status dos pedidos
- ✅ Reduz necessidade de polling constante
- ✅ Notificações em tempo real
- ✅ Melhor experiência para o cliente

## Como Configurar

### 1. Criar Endpoint no Backend

Você precisa criar um endpoint HTTPS no seu backend para receber as notificações:

```typescript
// Exemplo: backend/routes/webhooks.ts
import { Request, Response } from 'express';

export async function mercadopagoWebhook(req: Request, res: Response) {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Consultar pagamento na API do Mercado Pago
      const payment = await getPayment(paymentId);
      
      // Atualizar status do pedido no banco de dados
      await updateOrderStatus(payment.external_reference, payment.status);
      
      // Enviar email de confirmação (se aprovado)
      if (payment.status === 'approved') {
        await sendConfirmationEmail(payment);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).send('Error');
  }
}
```

### 2. Configurar URL no Mercado Pago

#### Opção A: Via Painel do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação "Bravos Brasil Real"
3. Vá em "Notificações"
4. Adicione a URL do seu webhook:
   ```
   https://api.bravosbrasil.com.br/webhooks/mercadopago
   ```
5. Selecione os tópicos:
   - ✅ `payment` - Notificações de pagamento

#### Opção B: Via API (usando MCP)

Você pode usar a ferramenta MCP do Mercado Pago para configurar:

```typescript
// Exemplo de uso da ferramenta save_webhook
mcp_mcp-mercadopago-prod-oauth_save_webhook({
  callback: 'https://api.bravosbrasil.com.br/webhooks/mercadopago',
  topics: ['payment']
});
```

### 3. Configurar Variável de Ambiente

Adicione no seu `.env`:

```env
VITE_MERCADOPAGO_WEBHOOK_URL=https://api.bravosbrasil.com.br/webhooks/mercadopago
```

### 4. Validar Webhook (Segurança)

**IMPORTANTE**: Sempre valide as notificações recebidas!

```typescript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function validateWebhook(
  paymentId: string,
  notificationData: any
): Promise<boolean> {
  try {
    // Consultar pagamento diretamente na API
    const payment = await new Payment(client).get({ id: paymentId });
    
    // Verificar se os dados batem
    if (payment.id.toString() === notificationData.id) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao validar webhook:', error);
    return false;
  }
}
```

## Tipos de Notificações

### Payment (Pagamento)

```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

**Status possíveis:**
- `pending` - Pagamento pendente
- `approved` - Pagamento aprovado
- `rejected` - Pagamento rejeitado
- `cancelled` - Pagamento cancelado
- `refunded` - Pagamento reembolsado
- `charged_back` - Contestação (chargeback)

## Testando Webhooks

### 1. Usando ngrok (Desenvolvimento Local)

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000

# Usar URL gerada no Mercado Pago
# Exemplo: https://abc123.ngrok.io/webhooks/mercadopago
```

### 2. Usando MCP para Simular

Você pode usar a ferramenta `simulate_webhook` do MCP:

```typescript
// Simular notificação de pagamento
mcp_mcp-mercadopago-prod-oauth_simulate_webhook({
  resource_id: '1234567890', // ID do pagamento
  topic: 'payment',
  url_callback: 'https://api.bravosbrasil.com.br/webhooks/mercadopago'
});
```

### 3. Verificar Histórico

Use a ferramenta `notifications_history` do MCP para ver o histórico:

```typescript
mcp_mcp-mercadopago-prod-oauth_notifications_history();
```

## Boas Práticas

1. ✅ **Sempre retorne 200 OK** - Mesmo em caso de erro, retorne 200 para evitar reenvios
2. ✅ **Valide as notificações** - Consulte o pagamento na API antes de processar
3. ✅ **Use idempotência** - Evite processar a mesma notificação duas vezes
4. ✅ **Log todas as notificações** - Para debug e auditoria
5. ✅ **Processe assincronamente** - Use filas para processar notificações pesadas
6. ✅ **HTTPS obrigatório** - Webhooks só funcionam com HTTPS

## Estrutura Recomendada

```
backend/
  routes/
    webhooks.ts          # Rotas de webhook
  services/
    mercadopago.ts      # Serviço de integração
    orders.ts           # Serviço de pedidos
  handlers/
    payment-handler.ts  # Handler de notificações de pagamento
```

## Próximos Passos

1. ⚠️ Criar endpoint de webhook no backend
2. ⚠️ Configurar URL no painel do Mercado Pago
3. ⚠️ Implementar validação de segurança
4. ⚠️ Implementar processamento de notificações
5. ⚠️ Testar com webhooks simulados
6. ⚠️ Monitorar histórico de notificações
