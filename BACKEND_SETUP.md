# Backend Setup - Comandos Rápidos

## 🚀 Setup Inicial

### 1. Instalar Dependências

```bash
# Na raiz do projeto
npm install @prisma/client prisma cors dotenv express zod
npm install -D @types/cors @types/express @types/node tsx typescript
```

### 2. Configurar .env

Crie `server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bravos_brasil?schema=public"
MP_ACCESS_TOKEN=seu_access_token_aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
```

### 3. Executar Migrations

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name init

# (Opcional) Popular banco
npx tsx prisma/seed.ts
```

### 4. Iniciar Servidor

```bash
npx tsx server/index.ts
```

Ou adicione ao `package.json` principal:

```json
{
  "scripts": {
    "server:dev": "tsx watch server/index.ts",
    "server:build": "tsc -p server/tsconfig.json",
    "server:start": "node dist/index.js"
  }
}
```

## 📝 Estrutura de Arquivos

```
.
├── server/
│   ├── index.ts              # Servidor Express
│   ├── routes/
│   │   ├── health.ts
│   │   └── mp/
│   │       ├── create-payment.ts
│   │       └── webhooks.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── package.json
│   └── tsconfig.json
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── seed.ts               # Seed de dados
└── .env.backend.example
```

## ✅ Checklist

- [ ] PostgreSQL instalado
- [ ] Banco criado
- [ ] `.env` configurado
- [ ] `MP_ACCESS_TOKEN` configurado
- [ ] Migrations executadas
- [ ] Servidor rodando
