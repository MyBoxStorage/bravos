# Estado do Projeto

## Prisma

**Versão fixada:** 5.22.0 (evitar que `npx prisma` sem versão instale Prisma 7)

### Comando padrão para gerar client

```bash
npx prisma@5.22.0 generate --schema=./prisma/schema.prisma
```

### Scripts npm disponíveis

- `npm run prisma:generate` — gera o Prisma Client (raiz ou `cd server && npm run prisma:generate`)
- `npm run prisma:status` — verifica status das migrations
- `npm run prisma:migrate` — migrations em dev (apenas em server/)
- `npm run prisma:studio` — abre Prisma Studio (apenas em server/)

### Banco de dados (Supabase)

- Projeto: BravosBrasilEcommerce
- Schema: `prisma/schema.prisma`
- Client gerado em: `server/node_modules/.prisma/client`

## Backend Fly.io

**App name real:** `bravosbackend`  
**Host real:** `https://bravosbackend.fly.dev`

### Secrets (GitHub Actions)

- `MONITOR_API_URL`: deve ser `https://bravosbackend.fly.dev` (sem path)
- Usado por: deploy-backend-fly (smoke), monitor-production, reconcile-pending-production

**Passo manual:** GitHub > Settings > Secrets and variables > Actions > `MONITOR_API_URL` = `https://bravosbackend.fly.dev`
