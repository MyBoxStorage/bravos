import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.js';

export async function deleteCoupon(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'ID obrigatório' });
      return;
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: { _count: { select: { usages: true } } },
    });

    if (!coupon) {
      res.status(404).json({ error: 'Cupom não encontrado' });
      return;
    }

    if (coupon._count.usages > 0) {
      res.status(400).json({
        error:
          'Não é possível deletar cupom que já foi usado. Desative-o em vez disso.',
      });
      return;
    }

    await prisma.coupon.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Cupom deletado',
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Erro ao deletar cupom' });
  }
}
