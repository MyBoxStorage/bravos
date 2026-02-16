import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.js';

export async function updateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'ID obrigatório' });
      return;
    }
    const { isActive, maxUses, expiresAt } = req.body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(maxUses !== undefined && { maxUses: maxUses || null }),
        ...(expiresAt !== undefined && {
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        }),
      },
    });

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
}
