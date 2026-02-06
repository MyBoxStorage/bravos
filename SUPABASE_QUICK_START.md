# 🚀 Supabase - Quick Start

## ✅ Banco Criado com Sucesso!

**Projeto:** BravosBrasil  
**ID:** `joagnmqivhyxbkhskkjp`  
**API URL:** `https://joagnmqivhyxbkhskkjp.supabase.co`  
**Database Host:** `db.joagnmqivhyxbkhskkjp.supabase.co`

## 📊 Tabelas Criadas

✅ `products` - Produtos do e-commerce  
✅ `orders` - Pedidos com dados de pagamento  
✅ `order_items` - Itens de cada pedido

## 🔑 Obter DATABASE_URL

1. Acesse: https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
2. Role até **Connection string** → **URI**
3. Copie a URL (formato: `postgresql://postgres:[PASSWORD]@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres`)
4. Se não souber a senha, clique em **Reset database password**

## ⚙️ Configurar .env

Crie `server/.env`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.joagnmqivhyxbkhskkjp.supabase.co:5432/postgres?schema=public"
MP_ACCESS_TOKEN=seu_access_token_aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001
```

## 🚀 Próximos Comandos

```bash
# 1. Gerar Prisma Client
npx prisma generate

# 2. Testar conexão
npx prisma db pull

# 3. Popular banco (opcional)
npx tsx prisma/seed.ts

# 4. Iniciar servidor
npx tsx server/index.ts
```

## 🔗 Links Úteis

- **Painel:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp
- **Table Editor:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/editor
- **Database Settings:** https://supabase.com/dashboard/project/joagnmqivhyxbkhskkjp/settings/database
