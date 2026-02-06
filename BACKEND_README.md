# Backend API - BRAVOS BRASIL

Backend Express.js com integração Mercado Pago Payments API (PIX e Boleto).

## 🏗️ Stack

- **Node.js** + **Express**
- **Prisma** + **PostgreSQL**
- **Mercado Pago Payments API**
- **TypeScript**

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

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migrations
npm run prisma:migrate
```

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

### 2. Testar Webhook com ngrok

1. **Instalar ngrok:**
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

5. **Simular notificação:**
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
- `id`, `total`, `status` (PENDING/PAID/CANCELED/FAILED/REFUNDED)
- `mpPaymentId`, `mpStatus`
- `payerName`, `payerEmail`, `payerCpf`, `payerPhone`
- `paymentMethod` (pix/bolbradesco)
- `pixQrCode`, `pixCopyPaste`, `boletoUrl`, `boletoBarcode`
- `externalReference` (único)
- `createdAt`, `updatedAt`

### OrderItems
- `id`, `orderId`, `productId`, `quantity`, `unitPrice`
- `size`, `color`
- `createdAt`

## 🔒 Segurança

- ✅ Access Token **NUNCA** exposto no frontend
- ✅ Validação de entrada com Zod
- ✅ Tratamento de erros robusto
- ✅ Idempotência em webhooks
- ✅ CORS configurado
- ✅ Logging de operações

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
