# 🔑 Configuração Completa de Variáveis de Ambiente

## 📋 Resumo Rápido

Este projeto precisa de **2 arquivos .env**:

1. **`.env`** (raiz) → Frontend (React/Vite)
2. **`server/.env`** → Backend (Express)

## 🚀 Setup Rápido

### 1. Criar `.env` na raiz do projeto:

```env
# Mercado Pago - Public Key (Frontend)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Mercado Pago - Webhook URL (Opcional)
VITE_MERCADOPAGO_WEBHOOK_URL=https://api.bravosbrasil.com.br/api/mp/webhooks
```

### 2. Criar `server/.env`:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public"

# Mercado Pago - Access Token (Backend)
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Server
PORT=3001
NODE_ENV=development
```

## 📝 Detalhamento Completo

### 🌐 FRONTEND (`.env` na raiz)

#### `VITE_MERCADOPAGO_PUBLIC_KEY`
- **Onde é usado:** `src/components/MercadoPagoProvider.tsx:21`
- **Como obter:** https://www.mercadopago.com.br/developers/panel/credentials → Public Key
- **Formato:** `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Obrigatório:** ✅ Sim
- **Pode expor:** ✅ Sim (é público)

#### `VITE_MERCADOPAGO_WEBHOOK_URL`
- **Onde é usado:** 
  - `src/components/PaymentBrick.tsx:66`
  - `src/config/mercadopago.config.ts:26`
- **Como obter:** URL do seu backend onde o webhook será recebido
- **Formato:** `https://api.bravosbrasil.com.br/api/mp/webhooks`
- **Obrigatório:** ⚠️ Opcional (mas recomendado)

### 🖥️ BACKEND (`server/.env`)

#### `DATABASE_URL`
- **Onde é usado:** 
  - `prisma/schema.prisma:11`
  - Prisma Client (automaticamente)
- **Como obter:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database → Connection string → URI
- **Formato:** `postgresql://postgres:[PASSWORD]@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public`
- **Obrigatório:** ✅ Sim
- **Pode expor:** ❌ NUNCA

#### `MP_ACCESS_TOKEN`
- **Onde é usado:** 
  - `server/routes/mp/create-payment.ts:56`
  - `server/routes/mp/webhooks.ts:49`
- **Como obter:** https://www.mercadopago.com.br/developers/panel/credentials → Access Token
- **Formato:** `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Obrigatório:** ✅ Sim
- **Pode expor:** ❌ NUNCA (server-side only)

#### `FRONTEND_URL`
- **Onde é usado:** `server/index.ts:23` (configuração CORS)
- **Valor desenvolvimento:** `http://localhost:5173`
- **Valor produção:** `https://bravosbrasil.com.br`
- **Obrigatório:** ✅ Sim

#### `BACKEND_URL`
- **Onde é usado:** `server/routes/mp/create-payment.ts:93` (URL do webhook)
- **Valor desenvolvimento:** `http://localhost:3001`
- **Valor produção:** `https://api.bravosbrasil.com.br`
- **Obrigatório:** ✅ Sim

#### `PORT`
- **Onde é usado:** `server/index.ts:19`
- **Padrão:** `3001`
- **Obrigatório:** ⚠️ Opcional

#### `NODE_ENV`
- **Onde é usado:** `server/index.ts:48` (mostra erros detalhados em dev)
- **Valores:** `development` | `production`
- **Padrão:** `development`
- **Obrigatório:** ⚠️ Opcional

## 🔍 Onde Cada Variável é Chamada no Código

### Frontend

```typescript
// src/components/MercadoPagoProvider.tsx:21
const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(publicKey, { locale: 'pt-BR' });

// src/components/PaymentBrick.tsx:66
...(import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL && {
  notification_url: import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL,
})

// src/config/mercadopago.config.ts:26
WEBHOOK_URL: import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL || '',
```

### Backend

```typescript
// server/index.ts:19
const PORT = process.env.PORT || 3001;

// server/index.ts:23
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// server/index.ts:48
message: process.env.NODE_ENV === 'development' ? err.message : undefined,

// server/routes/mp/create-payment.ts:56
const accessToken = process.env.MP_ACCESS_TOKEN;

// server/routes/mp/create-payment.ts:93
notification_url: process.env.BACKEND_URL 
  ? `${process.env.BACKEND_URL}/api/mp/webhooks`
  : undefined,

// server/routes/mp/webhooks.ts:49
const accessToken = process.env.MP_ACCESS_TOKEN;

// prisma/schema.prisma:11 (usado automaticamente pelo Prisma)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔐 Como Obter Cada Chave

### 1. Mercado Pago - Public Key e Access Token

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione sua aplicação
3. Copie:
   - **Public Key** → `VITE_MERCADOPAGO_PUBLIC_KEY`
   - **Access Token** → `MP_ACCESS_TOKEN`

### 2. Supabase - DATABASE_URL

1. Acesse: https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
2. Role até **Connection string** → **URI**
3. Copie a URL completa
4. Se não souber a senha: **Reset database password**

## ✅ Checklist Final

### Frontend (`.env` na raiz)
- [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` configurado
- [ ] `VITE_MERCADOPAGO_WEBHOOK_URL` configurado (opcional)

### Backend (`server/.env`)
- [ ] `DATABASE_URL` configurado
- [ ] `MP_ACCESS_TOKEN` configurado
- [ ] `FRONTEND_URL` configurado
- [ ] `BACKEND_URL` configurado
- [ ] `PORT` configurado (opcional)
- [ ] `NODE_ENV` configurado (opcional)

## 🚨 Segurança

- ✅ `VITE_MERCADOPAGO_PUBLIC_KEY` pode ser exposto (é público)
- ❌ `MP_ACCESS_TOKEN` NUNCA exponha no frontend
- ❌ `DATABASE_URL` NUNCA exponha no frontend
