# Quick Start - Mercado Pago React SDK

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
```

**Como obter a Public Key:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Selecione aplicação "Bravos Brasil Real"
3. Copie a **Public Key** (não confundir com Access Token)

### 3. Executar Projeto

```bash
npm run dev
```

### 4. Testar Checkout

1. Adicione produtos ao carrinho
2. Clique em "FINALIZAR COMPRA"
3. Preencha os dados pessoais
4. Clique em "CONTINUAR PARA PAGAMENTO"
5. O Payment Brick será exibido
6. Selecione método de pagamento e finalize

## 📋 Checklist

- [ ] SDK React instalado (`@mercadopago/sdk-react`)
- [ ] Public Key configurada no `.env`
- [ ] MercadoPagoProvider envolvendo a aplicação
- [ ] Payment Brick renderizando corretamente
- [ ] Testar em ambiente de desenvolvimento

## 🔍 Verificação

### Verificar se SDK está funcionando

Abra o console do navegador e verifique:
- ✅ Sem erros de inicialização
- ✅ Payment Brick carregando
- ✅ Métodos de pagamento aparecendo

### Problemas Comuns

**Erro: "VITE_MERCADOPAGO_PUBLIC_KEY não está configurado"**
- Solução: Adicione a Public Key no arquivo `.env`

**Payment Brick não aparece**
- Verifique se o MercadoPagoProvider está envolvendo a aplicação
- Verifique se a Public Key está correta
- Verifique o console para erros

**Erro de importação do SDK**
- Execute: `npm install @mercadopago/sdk-react`
- Reinicie o servidor: `npm run dev`

## 📚 Documentação

- [SDK React Integration](./SDK_REACT_INTEGRATION.md)
- [Integration Summary](./INTEGRATION_SUMMARY.md)
- [Webhook Setup](./WEBHOOK_SETUP.md)

## 🎯 Próximos Passos

1. Configurar Public Key
2. Testar checkout em desenvolvimento
3. Criar backend para webhooks (opcional)
4. Criar páginas de resultado (success/failure/pending)
