# Guia de Migração - Backend Setup

## 📋 Passo a Passo

### 1. Instalar Dependências do Backend

```bash
cd server
npm install
```

### 2. Configurar PostgreSQL

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE bravos_brasil;
```

Ou use um serviço gerenciado (Supabase, Railway, etc).

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `server/.env`:

```bash
cp .env.backend.example server/.env
```

Edite `server/.env` e configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bravos_brasil?schema=public"
MP_ACCESS_TOKEN=seu_access_token_aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
```

### 4. Executar Migrations

```bash
cd server

# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migrations
npm run prisma:migrate

# (Opcional) Popular banco com dados iniciais
npm run prisma:seed
```

### 5. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3001`

## 🧪 Testar Endpoints

### Health Check

```bash
curl http://localhost:3001/health
```

### Criar Pagamento PIX

```bash
curl -X POST http://localhost:3001/api/mp/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "1",
        "quantity": 1,
        "unitPrice": 89.90,
        "size": "M",
        "color": "preto"
      }
    ],
    "payer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "cpf": "12345678900"
    },
    "amount": 89.90,
    "paymentMethod": "pix"
  }'
```

### Criar Pagamento Boleto

```bash
curl -X POST http://localhost:3001/api/mp/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "1",
        "quantity": 1,
        "unitPrice": 89.90
      }
    ],
    "payer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "cpf": "12345678900"
    },
    "amount": 89.90,
    "paymentMethod": "bolbradesco"
  }'
```

## 🔗 Testar Webhook com ngrok

### 1. Instalar ngrok

```bash
npm install -g ngrok
```

### 2. Expor porta local

```bash
ngrok http 3001
```

### 3. Copiar URL do ngrok

Exemplo: `https://abc123.ngrok.io`

### 4. Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione aplicação "Bravos Brasil Real"
3. Vá em "Notificações"
4. Adicione URL: `https://abc123.ngrok.io/api/mp/webhooks`
5. Selecione tópico: `payment`

### 5. Simular notificação

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

## 📊 Verificar Dados

### Prisma Studio

```bash
cd server
npm run prisma:studio
```

Acesse: http://localhost:5555

## ✅ Checklist

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados criado
- [ ] `.env` configurado
- [ ] `MP_ACCESS_TOKEN` configurado
- [ ] Migrations executadas
- [ ] Servidor rodando
- [ ] Health check funcionando
- [ ] Teste de create-payment funcionando
- [ ] Webhook configurado (ngrok)
