# Configuração de Variáveis de Ambiente

## Mercado Pago

Para usar a integração com o Mercado Pago, você precisa configurar o Access Token.

### Passos:

1. Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`)

2. Adicione a seguinte variável:

```env
VITE_MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
```

### Como obter o Access Token:

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Faça login na sua conta do Mercado Pago
3. Selecione sua aplicação ou crie uma nova
4. Copie o **Access Token** (não confundir com Public Key)
5. Cole no arquivo `.env`

### Importante:

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Use `.env.example` como referência (se existir)
- Para produção, configure as variáveis de ambiente no seu provedor de hospedagem

### Variáveis de Ambiente no Vite:

No Vite, todas as variáveis de ambiente devem começar com `VITE_` para serem expostas ao código do cliente.

### Exemplo de `.env`:

```env
# Mercado Pago
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890-123456-abcdefghijklmnopqrstuvwxyz-123456789

# Outras variáveis (se necessário)
# VITE_API_BASE_URL=http://localhost:3000/api
```

### Após configurar:

1. Reinicie o servidor de desenvolvimento (`npm run dev`)
2. As variáveis estarão disponíveis via `import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN`
