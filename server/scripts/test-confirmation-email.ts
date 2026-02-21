/**
 * Script temporário para testar envio de e-mail de confirmação de pedido.
 * Usa Resend.
 *
 * Executar: cd app && npx tsx server/scripts/test-confirmation-email.ts
 */
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const { sendOrderConfirmationEmail } = await import('../utils/email.js');

const payload = {
  name: 'Pedro Bonfante',
  email: 'regomes23@icloud.com',
  orderId: 'order_TESTE123456',
  items: [
    { name: 'Camiseta Patriota', color: 'verde', size: 'GG', quantity: 1, unitPrice: 89.9 },
    { name: 'Boné Brasil', color: 'azul', size: 'M', quantity: 1, unitPrice: 49.9 },
  ],
  shippingCost: 0,
  couponDiscount: 0,
  total: 139.8,
  shippingAddress: 'Rua das Nações, 1822 - Rio de Janeiro, RJ - CEP 22041-001',
};

console.log('Enviando e-mail de teste para regomes23@icloud.com...\n');

try {
  const result = await sendOrderConfirmationEmail(payload);
  console.log('\n=== Retorno completo de sendOrderConfirmationEmail ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n✅ E-mail enviado com sucesso');
} catch (err) {
  console.error('\n❌ Erro ao enviar:', err);
  process.exit(1);
}
