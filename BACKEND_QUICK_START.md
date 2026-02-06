# 🚀 Backend - Quick Start

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install @prisma/client prisma cors dotenv express zod
npm install -D @types/cors @types/express @types/node tsx typescript

# 2. Configurar .env (criar server/.env)
DATABASE_URL="postgresql://user:password@localhost:5432/bravos_brasil?schema=public"
MP_ACCESS_TOKEN=seu_access_token_aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001

# 3. Executar migrations
npx prisma generate
npx prisma migrate dev --name init

# 4. Iniciar servidor
npx tsx server/index.ts
```

## 📡 Endpoints

### `POST /api/mp/create-payment`

Cria pagamento PIX ou Boleto.

**Request:**
```json
{
  "items": [{"productId": "1", "quantity": 1, "unitPrice": 89.90}],
  "payer": {"name": "João", "email": "joao@email.com", "cpf": "12345678900"},
  "amount": 89.90,
  "paymentMethod": "pix"
}
```

**Response (PIX):**
```json
{
  "orderId": "...",
  "paymentId": 1234567890,
  "status": "pending",
  "pix": {
    "qrCode": "data:image/png;base64,...",
    "copyPaste": "00020126..."
  }
}
```

### `POST /api/mp/webhooks`

Recebe notificações do Mercado Pago.

### `GET /health`

Health check.

## 🧪 Testar

```bash
# Health check
curl http://localhost:3001/health

# Criar pagamento PIX
curl -X POST http://localhost:3001/api/mp/create-payment \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"1","quantity":1,"unitPrice":89.90}],"payer":{"name":"Teste","email":"teste@email.com"},"amount":89.90,"paymentMethod":"pix"}'
```

## 📚 Documentação Completa

Veja `BACKEND_README.md` para detalhes completos.
