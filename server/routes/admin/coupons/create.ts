import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.js';

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, type, value, maxUses, expiresAt } = req.body;

    if (!code || !type || value === undefined) {
      res.status(400).json({ error: 'Código, tipo e valor são obrigatórios' });
      return;
    }

    const normalizedCode = code.trim().toUpperCase();

    if (type === 'PERCENTAGE' && value > 20) {
      res.status(400).json({ error: 'Desconto máximo: 20%' });
      return;
    }

    if (value <= 0) {
      res.status(400).json({ error: 'Valor deve ser maior que zero' });
      return;
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      res.status(400).json({ error: 'Código já existe' });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        type,
        value,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Erro ao criar cupom' });
  }
}
