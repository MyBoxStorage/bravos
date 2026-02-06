# 📁 Estrutura de Arquivos - Backend

## Arquivos Criados

```
.
├── server/
│   ├── index.ts                    # Servidor Express principal
│   ├── package.json                 # Dependências do backend
│   ├── tsconfig.json                # Configuração TypeScript
│   ├── .gitignore                   # Arquivos ignorados
│   ├── routes/
│   │   ├── health.ts                # GET /health
│   │   └── mp/
│   │       ├── create-payment.ts    # POST /api/mp/create-payment
│   │       └── webhooks.ts          # POST /api/mp/webhooks
│   ├── types/
│   │   └── index.ts                 # Tipos TypeScript
│   └── utils/
│       └── logger.ts                # Utilitário de logging
│
├── prisma/
│   ├── schema.prisma                # Schema do banco de dados
│   └── seed.ts                      # Script de seed (produtos iniciais)
│
├── .env.backend.example              # Exemplo de variáveis de ambiente
│
└── Documentação:
    ├── BACKEND_README.md             # Documentação completa
    ├── BACKEND_QUICK_START.md        # Guia rápido
    ├── BACKEND_SETUP.md              # Setup detalhado
    └── MIGRATION_GUIDE.md            # Guia de migração
```

## 📦 Dependências Principais

### Produção
- `express` - Framework web
- `@prisma/client` - ORM
- `cors` - CORS middleware
- `dotenv` - Variáveis de ambiente
- `zod` - Validação de dados

### Desenvolvimento
- `typescript` - TypeScript
- `tsx` - Executar TypeScript
- `prisma` - CLI do Prisma
- `@types/*` - Tipos TypeScript

## 🔧 Comandos Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name init

# Aplicar migrations (produção)
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Executar seed
npx tsx prisma/seed.ts
```

## 🗄️ Schema do Banco

### Models
- **Product** - Produtos do e-commerce
- **Order** - Pedidos com status e dados de pagamento
- **OrderItem** - Itens de cada pedido

### Enums
- **OrderStatus** - PENDING, PAID, CANCELED, FAILED, REFUNDED
