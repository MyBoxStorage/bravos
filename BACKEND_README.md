# Backend API - BRAVOS BRASIL

Backend Express.js com integração Mercado Pago Payments API (PIX e Boleto).

## 🏗️ Stack

- **Node.js** + **Express**
- **Prisma** + **PostgreSQL**
- **Mercado Pago Payments API**
- **TypeScript**

## 📋 Endpoints Disponíveis

### Consulta de Pedidos

#### `GET /api/orders/:externalReference`
Consulta um pedido por externalReference (somente leitura).

**Parâmetros:**
- `externalReference` (path): Número do pedido (ex: `BRAVOS-123456`)

**Response:**
```json
{
  "orderId": "clx...",
  "externalReference": "BRAVOS-123456",
  "status": "READY_FOR_MONTINK",
  "totals": {
    "subtotal": 250.00,
    "discountTotal": 0,
    "shippingCost": 15.00,
    "total": 265.00
  },
  "shipping": {
    "cep": "01310-100",
    "address1": "Av. Paulista",
    "number": "1000",
    "district": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "complement": "Apto 101",
    "service": "montink_standard",
    "deadline": 5
  },
  "items": [
    {
      "productId": "clx...",
      "quantity": 2,
      "unitPrice": 125.00,
      "size": "M",
      "color": "Preto",
      "name": "Camiseta BRAVOS"
    }
  ],
  "mpStatus": "approved",
  "mpPaymentId": "123456789",
  "montinkStatus": null,
  "montinkOrderId": null,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

**Notas:**
- Não retorna dados sensíveis (CPF, telefone completo)
- Email do pagador não é retornado por segurança
- Inclui nome do produto se disponível

### Operação Administrativa

#### `POST /api/orders/:externalReference/mark-montink`
Marca um pedido como enviado à Montink (operação administrativa).

**Autenticação:**
- Header obrigatório: `x-admin-token: <ADMIN_TOKEN>`
- `ADMIN_TOKEN` deve estar configurado no `.env`

**Parâmetros:**
- `externalReference` (path): Número do pedido

**Request Body:**
```json
{
  "montinkOrderId": "MONTINK-123456",
  "montinkStatus": "em_producao"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pedido marcado como enviado à Montink",
  "order": {
    "orderId": "clx...",
    "externalReference": "BRAVOS-123456",
    "status": "SENT_TO_MONTINK",
    "montinkOrderId": "MONTINK-123456",
    "montinkStatus": "em_producao"
  }
}
```

**Regras:**
- Só permite se `Order.status` for `READY_FOR_MONTINK` ou `PAID`
- Atualiza `status` para `SENT_TO_MONTINK`
- Retorna 401 se token inválido ou ausente
- Retorna 400 se status do pedido não permitir
- Cria um registro de auditoria em `AdminEvent` com `action="MARK_MONTINK"`

**Auditoria (AdminEvent):**
- Tabela: `admin_events`
- Campos principais:
  - `action`: string (ex: `"MARK_MONTINK"`)
  - `order_id`: ID interno do pedido
  - `external_reference`: referência externa do pedido
  - `metadata`: JSON com detalhes (ex: `{ "montinkOrderId": "...", "montinkStatus": "..." }`)
  - `created_at`: timestamp da ação

**Model Prisma (resumo):**
```prisma
model AdminEvent {
  id                String   @id @default(cuid())
  action            String
  orderId           String   @map("order_id")
  externalReference String   @map("external_reference")
  metadata          Json?
  createdAt         DateTime @default(now()) @map("created_at")

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("admin_events")
}
```

**Migration manual (SQL):**
- Arquivo: `prisma/migrations/add_admin_events.sql`
- Responsável por criar a tabela `admin_events` e o índice em `order_id`.

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3001/api/orders/BRAVOS-123456/mark-montink \
  -H "Content-Type: application/json" \
  -H "x-admin-token: seu_admin_token_aqui" \
  -d '{
    "montinkOrderId": "MONTINK-123456",
    "montinkStatus": "em_producao"
  }'
```

## 📦 Instalação

### 1. Instalar Dependências

```bash
cd server
npm install
```

### 2. Configurar Banco de Dados

Crie um banco PostgreSQL e configure a URL no `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bravos_brasil?schema=public"
```

### 3. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bravos_brasil?schema=public"

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Server
PORT=3001
NODE_ENV=development
```

### 4. Executar Migrations

**Produção (Fly):** Migrations rodam automaticamente no deploy via `release_command`:
`npx prisma migrate deploy --schema=./prisma/schema.prisma`. Nenhum passo manual necessário.

**Local / desenvolvimento:**

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migrations (DEV-ONLY)
npm run prisma:migrate
```

**Importante (dev):** Se adicionou novos valores ao enum `OrderStatus`, execute também (quando aplicável):
`psql $DATABASE_URL -f prisma/migrations/add_montink_order_statuses.sql`

## 🚀 Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 📡 Endpoints

### `GET /health`

Health check do servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "service": "BRAVOS BRASIL API"
}
```

### `POST /api/mp/create-payment`

Cria um pagamento no Mercado Pago (PIX ou Boleto).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod-123",
      "quantity": 2,
      "unitPrice": 89.90,
      "size": "M",
      "color": "preto"
    }
  ],
  "payer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678900",
    "phone": "11999999999"
  },
  "amount": 179.80,
  "paymentMethod": "pix"
}
```

**Response (PIX):**
```json
{
  "orderId": "order-123",
  "paymentId": 1234567890,
  "status": "pending",
  "paymentMethod": "pix",
  "pix": {
    "qrCode": "data:image/png;base64,...",
    "copyPaste": "00020126..."
  }
}
```

**Response (Boleto):**
```json
{
  "orderId": "order-123",
  "paymentId": 1234567890,
  "status": "pending",
  "paymentMethod": "bolbradesco",
  "boleto": {
    "url": "https://www.mercadopago.com.br/payments/1234567890/ticket",
    "barcode": "34191..."
  }
}
```

### `POST /api/mp/webhooks`

Recebe notificações do Mercado Pago sobre mudanças de status de pagamento.

**Request Body (Mercado Pago):**
```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

**Response:**
```json
{
  "received": true
}
```

### `POST /api/shipping/quote`

Calcula o custo de frete via API Montink com fallback automático para frete fixo.

**Estratégia de Frete (Configurada em `server/config/shipping.ts`):**

Atualmente configurado como `MONTINK_PRIMARY_WITH_FALLBACK`:

1. **Tentativa primária:** Calcula frete via API Montink (se CEP e itens fornecidos)
2. **Seleção de opção:** Escolhe a opção mais barata entre as disponíveis
3. **Fallback automático:** Se Montink falhar:
   - Usa frete fixo: R$15 ou grátis se subtotal > R$200
   - Loga warning para monitoramento
   - Continua checkout normalmente (não bloqueia o pedido)

**Request Body:**
```json
{
  "subtotal": 150.00,
  "cep": "01310-100",
  "items": [
    {
      "productId": "prod-123",
      "quantity": 2
    }
  ]
}
```

**Response (Montink sucesso):**
```json
{
  "shippingCost": 12.50,
  "service": "montink_standard",
  "deadline": 5,
  "freeShippingThreshold": 200,
  "isFree": false,
  "source": "montink"
}
```

**Response (Fallback):**
```json
{
  "shippingCost": 15,
  "service": "fallback_fixed",
  "deadline": null,
  "freeShippingThreshold": 200,
  "isFree": false,
  "source": "fallback"
}
```

**Campos do Response:**
- `shippingCost`: Custo do frete em reais
- `service`: Nome do serviço de entrega (ex: "montink_standard", "fallback_fixed")
- `deadline`: Prazo de entrega em dias (null se não disponível)
- `freeShippingThreshold`: Subtotal mínimo para frete grátis (sempre 200)
- `isFree`: Se o frete é grátis
- `source`: Origem do cálculo ("montink" ou "fallback")

**Notas:**
- Se `cep` ou `items` não forem fornecidos, usa fallback diretamente
- A opção de frete Montink escolhida é sempre a **mais barata** entre as disponíveis
- O fallback nunca bloqueia o checkout, garantindo continuidade do fluxo

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3001/api/shipping/quote \
  -H "Content-Type: application/json" \
  -d '{
    "subtotal": 250.00
  }'
```

### `POST /api/checkout/create-order`

Cria um pedido (Order) e seus itens (OrderItems) no banco de dados. O backend recalcula todos os totals (subtotal, desconto, frete, total) como source of truth.

**Request Body:**
```json
{
  "payer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678900",
    "phone": "11999999999"
  },
  "shipping": {
    "cep": "01310-100",
    "address1": "Avenida Paulista",
    "number": "1000",
    "district": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "complement": "Apto 101",
    "service": "PAC",
    "deadline": 10
  },
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "unitPrice": 89.90,
      "size": "M",
      "color": "preto"
    },
    {
      "productId": "2",
      "quantity": 1,
      "unitPrice": 94.90,
      "size": "G",
      "color": "azul"
    }
  ]
}
```

**Response:**
```json
{
  "orderId": "clx1234567890",
  "externalReference": "order_550e8400-e29b-41d4-a716-446655440000",
  "totals": {
    "subtotal": 274.70,
    "discountTotal": 13.74,
    "shippingCost": 15,
    "total": 275.96
  }
}
```

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3001/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "payer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999"
    },
    "shipping": {
      "cep": "01310-100",
      "address1": "Avenida Paulista",
      "number": "1000",
      "city": "São Paulo",
      "state": "SP"
    },
    "items": [
      {
        "productId": "1",
        "quantity": 3,
        "unitPrice": 89.90
      }
    ]
  }'
```

## 🧪 Testes Locais

### 1. Testar Create Payment

```bash
curl -X POST http://localhost:3001/api/mp/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 1,
        "unitPrice": 89.90
      }
    ],
    "payer": {
      "name": "Teste Usuario",
      "email": "teste@email.com",
      "cpf": "12345678900"
    },
    "amount": 89.90,
    "paymentMethod": "pix"
  }'
```

### 2. Testar Webhook

#### 2.1. Configurar Webhook no Mercado Pago

1. **Instalar ngrok (para desenvolvimento local):**
```bash
npm install -g ngrok
```

2. **Expor porta local:**
```bash
ngrok http 3001
```

3. **Copiar URL do ngrok** (ex: `https://abc123.ngrok.io`)

4. **Configurar webhook no Mercado Pago:**
   - Acesse: https://www.mercadopago.com.br/developers/panel/app
   - Vá em "Notificações"
   - Adicione: `https://abc123.ngrok.io/api/mp/webhooks`

#### 2.2. Como Funciona a Idempotência

O webhook usa a tabela `webhook_events` para garantir idempotência real (via banco de dados):

- **Índice único:** `[provider, eventId]` previne processamento duplicado
- **Status de processamento:** `processed`, `ignored`, `failed`
- **Auditoria:** payload completo armazenado para debug
- **Resposta rápida:** sempre retorna 200 imediatamente, processamento é assíncrono

**Fluxo:**
1. Webhook recebe notificação do Mercado Pago
2. Tenta criar registro em `webhook_events` com `provider="mercadopago"` e `eventId` (payment ID)
3. Se já existe (unique constraint), retorna 200 sem processar (idempotência)
4. Se não existe, cria registro com `status="received"` e processa
5. Após processamento, atualiza `status="processed"` e `processedAt`

#### 2.3. Simular Notificação de Pagamento

```bash
curl -X POST http://localhost:3001/api/mp/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "1234567890"
    }
  }'
```

**O que acontece:**
1. Webhook responde 200 imediatamente
2. Busca detalhes do pagamento na API do Mercado Pago
3. Extrai `external_reference` do pagamento
4. Busca `Order` pelo `externalReference`
5. Atualiza `Order` com:
   - `mpPaymentId`: ID do pagamento no MP
   - `mpStatus`: Status do pagamento no MP
   - `status`: Status mapeado (PAID/CANCELED/REFUNDED/PENDING)
6. Marca `WebhookEvent` como `processed`

#### 2.4. Verificar Processamento

```bash
# Abrir Prisma Studio
npm run prisma:studio

# Verificar:
# - Tabela webhook_events: eventos recebidos e status
# - Tabela orders: status atualizado conforme pagamento
```

#### 2.5. Mapeamento de Status

| Status Mercado Pago | Order Status |
|-------------------|--------------|
| `approved` | `READY_FOR_MONTINK` ⚠️ |
| `cancelled`, `rejected` | `CANCELED` |
| `refunded`, `charged_back` | `REFUNDED` |
| `pending`, `in_process` | `PENDING` |

⚠️ **Nota sobre `READY_FOR_MONTINK`:**
Quando o pagamento é aprovado, o pedido é marcado como `READY_FOR_MONTINK` (não `PAID`).
Isso indica que o pedido está pago e pronto para ser enviado à Montink quando o endpoint POST estiver disponível.

### 3. Verificar Pedidos no Banco

```bash
# Abrir Prisma Studio
npm run prisma:studio
```

## 📊 Schema do Banco

### Products
- `id`, `name`, `description`, `price`, `image`, `category`
- `sizes[]`, `colors[]`, `stock`
- `createdAt`, `updatedAt`

### Orders
- `id`, `total`, `subtotal`, `discountTotal`, `status` (PENDING/PAID/READY_FOR_MONTINK/SENT_TO_MONTINK/FAILED_MONTINK/CANCELED/FAILED/REFUNDED)
- `mpPaymentId`, `mpPreferenceId`, `mpStatus`
- `payerName`, `payerEmail`, `payerCpf`, `payerPhone`
- `paymentMethod` (pix/bolbradesco/checkout_preference)
- `pixQrCode`, `pixCopyPaste`, `boletoUrl`, `boletoBarcode`
- `externalReference` (único)
- **Endereço de entrega:** `shippingCep`, `shippingAddress1`, `shippingNumber`, `shippingDistrict`, `shippingCity`, `shippingState`, `shippingComplement`
- **Frete:** `shippingCost`, `shippingService`, `shippingDeadline`
- **Montink:** `montinkOrderId`, `montinkStatus`
- `createdAt`, `updatedAt`

### OrderItems
- `id`, `orderId`, `productId`, `quantity`, `unitPrice`
- `size`, `color`
- `createdAt`

### WebhookEvents
- `id`, `provider`, `eventId`, `eventType`
- `receivedAt`, `processedAt`, `payload` (JSON)
- `status` (processed/ignored/failed), `errorMessage`
- **Índice único:** `[provider, eventId]` (garante idempotência)

## 🚚 Estratégia de Cálculo de Frete

O sistema suporta diferentes estratégias de cálculo de frete, configuráveis em `server/config/shipping.ts`:

#### Estratégia Atual: `MONTINK_PRIMARY_WITH_FALLBACK`

Esta estratégia garante que o checkout nunca seja bloqueado por falhas na API de frete:

1. **Tentativa primária:** Calcula frete via API Montink
   - Requer `cep` e `items` no request
   - Chama endpoint `/shipping/quote` da Montink
   - Normaliza resposta em array de opções de frete
   - **Seleciona a opção mais barata** entre as disponíveis

2. **Fallback automático:** Se Montink falhar:
   - Usa frete fixo: R$15 ou grátis se subtotal > R$200
   - Loga warning para monitoramento
   - Permite que o checkout continue normalmente
   - Retorna `source: "fallback"` no response

**Configuração:**
```typescript
// server/config/shipping.ts
export const SHIPPING_STRATEGY: FreightStrategy = 'MONTINK_PRIMARY_WITH_FALLBACK';
```

**Valores de fallback:**
- Frete padrão: R$15,00
- Frete grátis: Subtotal > R$200,00

**Alternativa disponível:**
- `MONTINK_REQUIRED`: Requer que Montink funcione, retorna erro se falhar (não recomendado para MVP)

## 📦 Integração Montink - Pedidos

### Status do Pedido para Montink

O sistema possui status específicos para rastrear a integração com Montink:

- `READY_FOR_MONTINK`: Pedido pago, pronto para envio à Montink
- `SENT_TO_MONTINK`: Pedido enviado à Montink com sucesso
- `FAILED_MONTINK`: Falha ao enviar pedido à Montink

### Fluxo Atual (Webhook Mercado Pago)

Quando um pagamento é aprovado via webhook:

1. Webhook recebe notificação de `payment` com status `approved`
2. Sistema atualiza `Order.status = READY_FOR_MONTINK`
3. Sistema registra `mpPaymentId` e `mpStatus` no Order
4. **NÃO cria pedido na Montink ainda** (aguardando endpoint POST oficial)

### ⚠️ IMPORTANTE - Criação de Pedidos Montink

**Situação Atual:**
A API pública da Montink possui apenas endpoints GET documentados:
- ✅ `GET /order/{IDPEDIDO}` - Buscar pedido por ID
- ✅ `GET /products` - Listar produtos disponíveis
- ✅ `GET /calculate_shipping/{CEP}/{QTD}` - Calcular frete

**❌ NÃO há endpoint POST documentado para criar pedidos.**

**O que está implementado:**
- ✅ Função `getMontinkOrder(orderId)` - Busca pedido na Montink
- ✅ Função `listMontinkProducts()` - Lista produtos
- ✅ Função `mapOrderToMontinkPayload()` - Prepara payload para criação futura
- ✅ Status `READY_FOR_MONTINK` para marcar pedidos prontos
- ❌ Função `createMontinkOrder()` - **NÃO implementada** (endpoint POST não existe)

**Feature Flag:**
O sistema possui um feature flag para controlar criação automática de pedidos:
- `MONTINK_CREATE_ORDER_ENABLED=false` (padrão) - Desabilitado até endpoint POST estar disponível
- Quando habilitado (`true`), pedidos `READY_FOR_MONTINK` são automaticamente enviados à Montink

**Serviço de Fulfillment:**
- `server/services/montinkFulfillment.ts` - Processa fulfillment automaticamente
- Chamado via fire-and-forget quando Order vira `READY_FOR_MONTINK`
- Atualiza `Order.status` para `SENT_TO_MONTINK` (sucesso) ou `FAILED_MONTINK` (erro)
- Salva `montinkOrderId` e `montinkStatus` no Order

**Estratégia Futura:**
Quando o endpoint `POST /order` estiver disponível oficialmente:

1. Solicitar documentação oficial usando `MONTINK_SUPPORT_REQUEST_TEMPLATE.md`
2. Implementar `createMontinkOrder()` em `server/integrations/montink/orders.ts` com payload correto
3. Definir tipos `MontinkCreateOrderRequest` e `MontinkCreateOrderResponse` em `types.ts`
4. Testar com pedidos de teste
5. Ativar feature flag: `MONTINK_CREATE_ORDER_ENABLED=true` no `.env`
6. Sistema já está preparado para processar automaticamente via `montinkFulfillment.ts`

**Arquivos relacionados:**
- `server/integrations/montink/orders.ts` - Funções GET implementadas, `createMontinkOrder()` bloqueada
- `server/integrations/montink/mappers.ts` - Mapper preparado
- `server/services/montinkFulfillment.ts` - Serviço de fulfillment (aguardando endpoint POST)
- `server/routes/mp/webhooks.ts` - Marca como `READY_FOR_MONTINK` e dispara fulfillment
- `MONTINK_SUPPORT_REQUEST_TEMPLATE.md` - Template para solicitar documentação oficial

**Como Habilitar (quando endpoint POST estiver disponível):**
1. Adicionar no `server/.env`: `MONTINK_CREATE_ORDER_ENABLED=true`
2. Reiniciar servidor backend
3. Pedidos pagos serão automaticamente enviados à Montink

**Retry Manual (futuro):**
Para pedidos com status `FAILED_MONTINK`, será criado um endpoint futuro para retry manual.
Por enquanto, atualizar manualmente no banco ou aguardar implementação do endpoint de retry.

## 🔒 Segurança

- ✅ Access Token **NUNCA** exposto no frontend
- ✅ Validação de entrada com Zod
- ✅ Tratamento de erros robusto
- ✅ Idempotência em webhooks (tabela `WebhookEvent` com índice único)
- ✅ CORS configurado
- ✅ Logging de operações

## 📦 Persistência de Dados

### Endereço de Entrega
Todos os campos de endereço são opcionais e armazenados no modelo `Order`:
- CEP, endereço, número, bairro, cidade, estado, complemento

### Informações de Frete
- Custo do frete (`shippingCost`, padrão: 0)
- Serviço/transportadora (`shippingService`)
- Prazo de entrega em dias (`shippingDeadline`)

### Totais do Pedido
- `subtotal`: Subtotal antes de frete e descontos
- `discountTotal`: Desconto total aplicado
- `total`: Total final (já existia)

### Integração Montink
- `montinkOrderId`: ID do pedido no sistema Montink (opcional)
- `montinkStatus`: Status do pedido no Montink (opcional)

### Idempotência de Webhooks
A tabela `WebhookEvent` garante que eventos do Mercado Pago não sejam processados mais de uma vez:
- Índice único em `[provider, eventId]` previne duplicação
- Armazena payload completo para auditoria
- Rastreia status de processamento (processed/ignored/failed)

## 📝 Próximos Passos

1. ⚠️ Configurar `MP_ACCESS_TOKEN` no `.env`
2. ⚠️ Criar banco PostgreSQL
3. ⚠️ Executar migrations
4. ⚠️ Testar endpoints
5. ⚠️ Configurar webhook no Mercado Pago
6. ⚠️ Integrar frontend com backend

## 🔗 Links Úteis

- [Mercado Pago Payments API](https://www.mercadopago.com.br/developers/en/reference/payments/_payments/post)
- [PIX Integration](https://www.mercadopago.com.br/developers/en/docs/checkout-api-payments/integration-configuration/integrate-pix)
- [Prisma Docs](https://www.prisma.io/docs)
