/**
 * POST /api/mp/webhooks
 * 
 * Recebe notificações do Mercado Pago sobre mudanças de status de pagamento
 * 
 * Implementa idempotência para evitar processamento duplicado
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

// Cache simples para idempotência (em produção, use Redis)
const processedNotifications = new Set<string>();

export async function webhookHandler(req: Request, res: Response) {
  try {
    const { type, data } = req.body;

    logger.info(`Webhook received: type=${type}, data.id=${data?.id}`);

    // Validar estrutura básica
    if (!type || !data) {
      logger.warn('Invalid notification structure');
      return res.status(400).json({ error: 'Invalid notification structure' });
    }

    // Criar ID único para esta notificação
    const notificationId = `${type}-${data.id || Date.now()}-${JSON.stringify(data).substring(0, 50)}`;
    
    // Verificar idempotência
    if (processedNotifications.has(notificationId)) {
      logger.info(`Notification already processed: ${notificationId}`);
      return res.status(200).json({ message: 'Notification already processed' });
    }

    // Processar apenas notificações de pagamento
    if (type === 'payment') {
      const paymentId = data.id;
      
      if (!paymentId) {
        logger.warn('Payment ID missing');
        return res.status(400).json({ error: 'Payment ID missing' });
      }

      // Buscar detalhes do pagamento na API do Mercado Pago
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        logger.error('MP_ACCESS_TOKEN não configurado');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!mpResponse.ok) {
        const errorText = await mpResponse.text();
        logger.error(`Failed to fetch payment ${paymentId}:`, errorText);
        return res.status(mpResponse.status).json({ error: 'Failed to fetch payment details' });
      }

      const payment = await mpResponse.json();
      const externalReference = payment.external_reference;

      if (!externalReference) {
        logger.warn(`External reference missing for payment ${paymentId}`);
        return res.status(400).json({ error: 'External reference missing' });
      }

      // Buscar pedido pelo external_reference
      const order = await prisma.order.findUnique({
        where: { externalReference },
      });

      if (!order) {
        logger.warn(`Order not found for external reference: ${externalReference}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      // Mapear status do Mercado Pago para status do pedido
      let orderStatus: 'PENDING' | 'PAID' | 'CANCELED' | 'FAILED' | 'REFUNDED' = 'PENDING';

      switch (payment.status) {
        case 'approved':
          orderStatus = 'PAID';
          break;
        case 'cancelled':
        case 'rejected':
          orderStatus = 'CANCELED';
          break;
        case 'refunded':
        case 'charged_back':
          orderStatus = 'REFUNDED';
          break;
        case 'pending':
        case 'in_process':
          orderStatus = 'PENDING';
          break;
        default:
          logger.warn(`Unknown payment status: ${payment.status}`);
      }

      // Atualizar pedido apenas se o status mudou
      if (order.status !== orderStatus) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: orderStatus,
            mpStatus: payment.status,
            mpPaymentId: payment.id?.toString(),
          },
        });

        logger.info(`Order ${order.id} updated: ${order.status} -> ${orderStatus} (MP: ${payment.status})`);
      } else {
        logger.info(`Order ${order.id} status unchanged: ${orderStatus}`);
      }

      // Marcar notificação como processada
      processedNotifications.add(notificationId);
      
      // Limpar cache antigo (manter apenas últimas 1000)
      if (processedNotifications.size > 1000) {
        const firstKey = processedNotifications.values().next().value;
        processedNotifications.delete(firstKey);
      }
    }

    // Sempre retornar 200 para o Mercado Pago
    res.status(200).json({ received: true });

  } catch (error) {
    logger.error('Webhook error:', error);
    
    // Retornar 200 mesmo em caso de erro para evitar reenvios
    res.status(200).json({ 
      received: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
