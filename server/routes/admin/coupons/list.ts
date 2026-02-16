import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.js';

export async function listCoupons(req: Request, res: Response): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error('List coupons error:', error);
    res.status(500).json({ error: 'Erro ao listar cupons' });
  }
}
