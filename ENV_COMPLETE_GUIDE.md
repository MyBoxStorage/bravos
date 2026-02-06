# 📋 Guia Completo de Variáveis de Ambiente

## 🎯 Visão Geral

Este projeto usa **duas** configurações de `.env`:

1. **`.env`** (raiz do projeto) - Para o **Frontend** (React/Vite)
2. **`server/.env`** - Para o **Backend** (Express/Node.js)

## 📁 Estrutura de Arquivos .env

```
bravos-real/app/
├── .env                    ← Frontend (React/Vite)
└── server/
    └── .env               ← Backend (Express)
```

## 🔑 Variáveis por Ambiente

### 🌐 FRONTEND (`.env` na raiz)

| Variável | Onde é Usada | Obrigatório | Como Obter |
|----------|--------------|-------------|------------|
| `VITE_MERCADOPAGO_PUBLIC_KEY` | `src/components/MercadoPagoProvider.tsx:21` | ✅ Sim | Painel MP → Credentials → Public Key |
| `VITE_MERCADOPAGO_WEBHOOK_URL` | `src/components/PaymentBrick.tsx:66`<br>`src/config/mercadopago.config.ts:26` | ⚠️ Opcional | URL do seu backend: `https://api.bravosbrasil.com.br/api/mp/webhooks` |

### 🖥️ BACKEND (`server/.env`)

| Variável | Onde é Usada | Obrigatório | Como Obter |
|----------|--------------|-------------|------------|
| `DATABASE_URL` | `prisma/schema.prisma:11`<br>`server/routes/mp/create-payment.ts`<br>`server/routes/mp/webhooks.ts` | ✅ Sim | Supabase Dashboard → Settings → Database → Connection string |
| `MP_ACCESS_TOKEN` | `server/routes/mp/create-payment.ts:56`<br>`server/routes/mp/webhooks.ts:49` | ✅ Sim | Painel MP → Credentials → Access Token |
| `FRONTEND_URL` | `server/index.ts:23` (CORS) | ✅ Sim | URL do frontend: `http://localhost:5173` ou `https://bravosbrasil.com.br` |
| `BACKEND_URL` | `server/routes/mp/create-payment.ts:93` (webhook URL) | ✅ Sim | URL do backend: `http://localhost:3001` ou `https://api.bravosbrasil.com.br` |
| `PORT` | `server/index.ts:19` | ⚠️ Opcional | Porta do servidor (padrão: 3001) |
| `NODE_ENV` | `server/index.ts:48` | ⚠️ Opcional | `development` ou `production` |

## 📝 Exemplo Completo de Arquivos .env

### `.env` (Raiz - Frontend)

```env
# Mercado Pago - Public Key (pode ser exposto)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890-123456789

# Webhook URL (opcional)
VITE_MERCADOPAGO_WEBHOOK_URL=https://api.bravosbrasil.com.br/api/mp/webhooks
```

### `server/.env` (Backend)

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:minhasenha123@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public"

# Mercado Pago - Access Token (NUNCA expor no frontend!)
MP_ACCESS_TOKEN=APP_USR-9876543210987654-654321-fedcba0987654321fedcba0987654321-987654321

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Server
PORT=3001
NODE_ENV=development
```

## 🔍 Onde Cada Variável é Usada no Código

### Frontend (React/Vite)

#### `VITE_MERCADOPAGO_PUBLIC_KEY`
```typescript
// src/components/MercadoPagoProvider.tsx:21
const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(publicKey, { locale: 'pt-BR' });
```

#### `VITE_MERCADOPAGO_WEBHOOK_URL`
```typescript
// src/components/PaymentBrick.tsx:66
...(import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL && {
  notification_url: import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL,
})

// src/config/mercadopago.config.ts:26
WEBHOOK_URL: import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL || '',
```

### Backend (Express/Node.js)

#### `DATABASE_URL`
```typescript
// prisma/schema.prisma:11
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Usado automaticamente pelo Prisma Client
const prisma = new PrismaClient(); // Lê DATABASE_URL automaticamente
```

#### `MP_ACCESS_TOKEN`
```typescript
// server/routes/mp/create-payment.ts:56
const accessToken = process.env.MP_ACCESS_TOKEN;

// server/routes/mp/webhooks.ts:49
const accessToken = process.env.MP_ACCESS_TOKEN;
```

#### `FRONTEND_URL`
```typescript
// server/index.ts:23
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

#### `BACKEND_URL`
```typescript
// server/routes/mp/create-payment.ts:93
notification_url: process.env.BACKEND_URL 
  ? `${process.env.BACKEND_URL}/api/mp/webhooks`
  : undefined,
```

#### `PORT`
```typescript
// server/index.ts:19
const PORT = process.env.PORT || 3001;
```

#### `NODE_ENV`
```typescript
// server/index.ts:48
message: process.env.NODE_ENV === 'development' ? err.message : undefined,
```

## 🔐 Como Obter Cada Chave

### 1. Mercado Pago - Public Key e Access Token

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione sua aplicação (ou crie uma nova)
3. Copie:
   - **Public Key** → `VITE_MERCADOPAGO_PUBLIC_KEY` (frontend)
   - **Access Token** → `MP_ACCESS_TOKEN` (backend)

**⚠️ IMPORTANTE:**
- Public Key pode ser exposta no frontend
- Access Token **NUNCA** deve ser exposto no frontend!

### 2. Supabase - DATABASE_URL

1. Acesse: https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
2. Role até **Connection string** → **URI**
3. Copie a URL completa
4. Se não souber a senha:
   - Clique em **Reset database password**
   - Copie a nova senha (ela só aparece uma vez!)
   - Substitua `[YOUR-PASSWORD]` na URL

**Formato:**
```
postgresql://postgres:[PASSWORD]@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public
```

### 3. URLs (FRONTEND_URL e BACKEND_URL)

**Desenvolvimento:**
```env
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

**Produção:**
```env
FRONTEND_URL=https://bravosbrasil.com.br
BACKEND_URL=https://api.bravosbrasil.com.br
```

## ✅ Checklist de Configuração

### Frontend (`.env` na raiz)
- [ ] `VITE_MERCADOPAGO_PUBLIC_KEY` configurado
- [ ] `VITE_MERCADOPAGO_WEBHOOK_URL` configurado (opcional)

### Backend (`server/.env`)
- [ ] `DATABASE_URL` configurado (Supabase)
- [ ] `MP_ACCESS_TOKEN` configurado
- [ ] `FRONTEND_URL` configurado
- [ ] `BACKEND_URL` configurado
- [ ] `PORT` configurado (opcional)
- [ ] `NODE_ENV` configurado (opcional)

## 🚨 Segurança

### ✅ Pode ser exposto no frontend:
- `VITE_MERCADOPAGO_PUBLIC_KEY` (é público por design)

### ❌ NUNCA exponha no frontend:
- `MP_ACCESS_TOKEN` (Access Token)
- `DATABASE_URL` (senha do banco)
- Qualquer chave secreta do backend

### 🔒 Boas Práticas:
1. ✅ Use `.env.example` como template
2. ✅ Adicione `.env` ao `.gitignore`
3. ✅ NUNCA commite arquivos `.env`
4. ✅ Use diferentes chaves para desenvolvimento e produção
5. ✅ Rotacione chaves regularmente em produção

## 📚 Links Úteis

- **Mercado Pago Credentials:** https://www.mercadopago.com.br/developers/panel/credentials
- **Supabase Database Settings:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
