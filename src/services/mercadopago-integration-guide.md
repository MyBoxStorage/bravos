# Guia de Integração Mercado Pago - BRAVOS BRASIL

## Informações da Aplicação

- **App ID**: 8109795162351103
- **App Name**: Bravos Brasil Real
- **App Description**: Minha aplicação Bravos Brasil Real

## Checklist de Implementação

### ✅ Campos Obrigatórios (Implementation Requirements)

#### 1. Quantidade do produto/serviço
- **Campo**: `items.quantity`
- **Status**: ✅ Implementado
- **Descrição**: Enviar quantidade de cada item no carrinho

#### 2. Preço do item
- **Campo**: `items.unit_price`
- **Status**: ✅ Implementado
- **Descrição**: Preço unitário de cada item

#### 3. Descrição - Fatura do cartão
- **Campo**: `statement_descriptor`
- **Status**: ⚠️ A implementar
- **Descrição**: Reduz contestações e chargebacks
- **Recomendação**: Máximo 22 caracteres, ex: "BRAVOS BRASIL"

#### 4. Back URLs
- **Campo**: `back_urls`
- **Status**: ⚠️ A implementar
- **Descrição**: URLs de redirecionamento após pagamento
- **Campos necessários**:
  - `success`: URL de sucesso
  - `failure`: URL de falha
  - `pending`: URL de pendente

#### 5. Notificações Webhook
- **Campo**: `notification_url`
- **Status**: ⚠️ A implementar
- **Descrição**: Endpoint para receber notificações de pagamento
- **Recomendação**: Usar endpoint HTTPS seguro

#### 6. Referência Externa
- **Campo**: `external_reference`
- **Status**: ✅ Implementado (parcial)
- **Descrição**: Código único para correlacionar com sistema interno
- **Recomendação**: Usar ID do pedido interno

#### 7. Email do comprador
- **Campo**: `payer.email`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 8. Nome do comprador
- **Campo**: `payer.first_name`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 9. Sobrenome do comprador
- **Campo**: `payer.last_name`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 10. Categoria do item
- **Campo**: `items.category_id`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 11. Descrição do item
- **Campo**: `items.description`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 12. Código do item
- **Campo**: `items.id`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

#### 13. Nome do item
- **Campo**: `items.title`
- **Status**: ✅ Implementado
- **Descrição**: Melhora taxa de aprovação

### 📋 Boas Práticas (Good Practices)

#### 1. Modo Binário
- **Campo**: `binary_mode`
- **Valor**: `true`
- **Descrição**: Aprovação instantânea (aprovado ou rejeitado)
- **Quando usar**: Se o negócio requer aprovação imediata

#### 2. Data de Vencimento (Pagamentos Offline)
- **Campo**: `date_of_expiration`
- **Descrição**: Para boletos e pagamentos offline
- **Formato**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

#### 3. Integração com Anúncios
- **Campo**: `marketing_information`
- **Descrição**: Integrar com Facebook Pixel e Google Ads
- **Benefício**: Rastreamento de conversões

#### 4. Vigência da Preferência
- **Campos**: `expires`, `expiration_date_from`, `expiration_date_to`
- **Descrição**: Limitar tempo para completar pagamento

#### 5. Máximo de Parcelas
- **Campo**: `installments`
- **Descrição**: Número máximo de parcelas oferecidas

#### 6. Esquema Modal
- **Descrição**: Abrir checkout em modal no site
- **Benefício**: Melhor experiência do usuário

#### 7. Logos Oficiais
- **Descrição**: Mostrar logo do Mercado Pago
- **Benefício**: Aumenta confiança e conversão

#### 8. Mensagens de Resposta
- **Descrição**: Feedback claro sobre status do pagamento
- **Benefício**: Melhora experiência e reduz abandono

#### 9. Exclusão de Meios de Pagamento
- **Campo**: `excluded_payment_methods`
- **Descrição**: Excluir métodos não desejados

#### 10. Exclusão de Tipos de Pagamento
- **Campo**: `excluded_payment_types`
- **Descrição**: Excluir tipos não desejados

#### 11. Valor do Frete
- **Campo**: `shipment_amount`
- **Descrição**: Mostrar valor do frete se já calculado

#### 12. Consulta de Pagamento Notificado
- **Descrição**: Consultar pagamento após notificação
- **API**: `GET /v1/payments/{id}`

#### 13. Chargebacks (Contestações)
- **API**: Chargebacks API
- **Descrição**: Gerenciar disputas e enviar documentação

#### 14. Cancelamentos
- **API**: Payments API - Cancel
- **Descrição**: Cancelar pagamentos pendentes ou em processamento

#### 15. Devoluções
- **API**: Refunds API
- **Descrição**: Gerenciar devoluções parciais ou totais

#### 16. Relatório de Liberações
- **API**: Settlement API
- **Descrição**: Ver composição do saldo disponível

#### 17. Relatório de Transações
- **API**: Release API
- **Descrição**: Ver todas as transações que afetaram o saldo

#### 18. Endereço do Comprador
- **Campo**: `payer.address`
- **Descrição**: Melhora taxa de aprovação

#### 19. Identificação do Comprador
- **Campo**: `payer.identification`
- **Descrição**: Tipo e número de documento (CPF/CNPJ)

#### 20. Telefone do Comprador
- **Campo**: `payer.phone`
- **Descrição**: Melhora taxa de aprovação

## Próximos Passos

1. ✅ Configurar Access Token no `.env`
2. ⚠️ Implementar `statement_descriptor`
3. ⚠️ Configurar `back_urls`
4. ⚠️ Configurar `notification_url` (webhook)
5. ⚠️ Implementar endpoint de webhook no backend
6. ⚠️ Adicionar campos opcionais para melhorar aprovação
7. ⚠️ Configurar modo binário (se necessário)
8. ⚠️ Implementar consulta de pagamento após notificação
9. ⚠️ Implementar cancelamentos e devoluções
10. ⚠️ Adicionar logos do Mercado Pago no site

## Recursos Úteis

- [Documentação Checkout API](https://www.mercadopago.com/developers/pt/docs/checkout-api-payments/overview)
- [Painel de Integrações](https://www.mercadopago.com.br/developers/panel/app)
- [API Reference](https://www.mercadopago.com/developers/pt/reference)
