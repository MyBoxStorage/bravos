import type { Response } from 'express';
import { prisma } from '../../utils/prisma.js';
import type { AuthRequest } from '../../types/auth.js';

/**
 * POST /api/coupons/validate
 * Valida um cupom. Funciona com ou sem autenticação.
 * Se autenticado, verifica se o usuário já usou o cupom.
 */
export async function validateCoupon(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      res.status(400).json({ error: 'Código do cupom é obrigatório' });
      return;
    }

    const normalizedCode = (code as string).trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      res.status(404).json({ error: 'Cupom não encontrado' });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({ error: 'Cupom inativo' });
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ error: 'Cupom expirado' });
      return;
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ error: 'Cupom esgotado' });
      return;
    }

    if (userId) {
      const previousUse = await prisma.couponUsage.findFirst({
        where: {
          couponId: coupon.id,
          userId,
        },
      });

      if (previousUse) {
        res.status(400).json({ error: 'Você já usou este cupom' });
        return;
      }
    }

    res.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Erro ao validar cupom' });
  }
}
