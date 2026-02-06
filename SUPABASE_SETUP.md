# 🗄️ Supabase Database Setup - BRAVOS BRASIL

## ✅ Banco de Dados Criado

**Projeto:** BravosBrasil  
**ID:** `joagnmqivhyxbkhskkjp`  
**Região:** sa-east-1 (São Paulo, Brasil)  
**Status:** ACTIVE_HEALTHY  
**Host:** `db.joagnmqivhyxbkhskkjp.supabase.co`

## 📊 Schema Aplicado

✅ Migration `init_schema` aplicada com sucesso!

**Tabelas criadas:**
- `products` - Produtos do e-commerce
- `orders` - Pedidos com dados de pagamento
- `order_items` - Itens de cada pedido

**Enum criado:**
- `OrderStatus` - PENDING, PAID, CANCELED, FAILED, REFUNDED

## 🔗 Obter Connection String

### 1. Acessar Painel do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **BravosBrasil**
3. Vá em **Settings** → **Database**
4. Role até **Connection string** → **URI**

### 2. Copiar DATABASE_URL

A URL terá o formato:
```
postgresql://postgres:[YOUR-PASSWORD]@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha do banco.

### 3. Se não souber a senha:

1. Vá em **Settings** → **Database**
2. Role até **Database password**
3. Clique em **Reset database password**
4. Copie a nova senha (ela só aparece uma vez!)
5. Use no connection string

## ⚙️ Configurar .env

Crie o arquivo `server/.env`:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public"

# Mercado Pago
MP_ACCESS_TOKEN=seu_access_token_aqui

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Server
PORT=3001
NODE_ENV=development
```

## 🚀 Próximos Passos

### 1. Gerar Prisma Client

```bash
npx prisma generate
```

### 2. Verificar Conexão

```bash
npx prisma db pull
```

### 3. Popular Banco (Opcional)

```bash
npx tsx prisma/seed.ts
```

### 4. Abrir Prisma Studio

```bash
npx prisma studio
```

## 📋 Verificar Tabelas

Você pode verificar as tabelas criadas no Supabase:

1. Acesse o painel: https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp
2. Vá em **Table Editor**
3. Você verá as tabelas: `products`, `orders`, `order_items`

## 🔍 Informações do Projeto

- **Project ID:** `joagnmqivhyxbkhskkjp`
- **API URL:** Verificar no painel do Supabase
- **Database Host:** `db.joagnmqivhyxbkhskkjp.supabase.co`
- **PostgreSQL Version:** 17.6.1.063

## ✅ Checklist

- [x] Projeto criado no Supabase
- [x] Migration aplicada
- [x] Tabelas criadas
- [ ] DATABASE_URL configurada no `.env`
- [ ] Prisma Client gerado
- [ ] Conexão testada
- [ ] Seed executado (opcional)

## 🔗 Links Úteis

- **Painel do Projeto:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp
- **Table Editor:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/editor
- **Database Settings:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
