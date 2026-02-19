import type { Request, Response } from 'express';
import { prisma } from '../../utils/prisma.js';
import { sendAbandonedCartEmail } from '../../utils/email.js';
import { logger } from '../../utils/logger.js';

const MIN_MINUTES = 60;
const MAX_MINUTES = 1380;
const DEFAULT_MINUTES = 60;
const MAX_LIMIT = 100;

export async function sendAbandonedCartEmails(req: Request, res: Response): Promise<void> {
  const dryRun = req.body?.dryRun !== false;
  const olderThanMinutes = Math.min(
    Math.max(Number(req.body?.olderThanMinutes) || DEFAULT_MINUTES, MIN_MINUTES),
    MAX_MINUTES
  );
  const limit = Math.min(Number(req.body?.limit) || 50, MAX_LIMIT);

  const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      status: 'PENDING',
      mpPaymentId: null,
      payerEmail: { not: undefined },
      abandonedEmailSentAt: null,
      createdAt: { lt: cutoff },
    },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    take: limit,
    orderBy: { createdAt: 'asc' },
  });

  if (dryRun) {
    logger.info('[ABANDONED_CART_EMAIL] Dry run', { olderThanMinutes, limit, found: orders.length });
    res.json({
      dryRun: true,
      found: orders.length,
      orders: orders.map(o => ({ id: o.id, email: o.payerEmail, createdAt: o.createdAt })),
    });
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const order of orders) {
    try {
      await sendAbandonedCartEmail({
        name: order.payerName || 'Cliente',
        email: order.payerEmail!,
        orderId: order.id,
        externalReference: order.externalReference,
        items: order.items.map(item => ({
          name: item.product?.name || 'Produto',
          color: item.color || '',
          size: item.size || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        total: order.total,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { abandonedEmailSentAt: new Date() },
      });

      sent++;
    } catch (err) {
      logger.error(`[ABANDONED_CART_EMAIL] Erro pedido ${order.id}`, { error: err instanceof Error ? err.message : 'Unknown' });
      failed++;
    }
  }

  logger.info('[ABANDONED_CART_EMAIL] Applied', { found: orders.length, sent, failed });
  res.json({ dryRun: false, found: orders.length, sent, failed });
}
