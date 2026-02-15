import type { Response } from 'express';
import { prisma } from '../../utils/prisma.js';
import type { AuthRequest } from '../../types/auth.js';

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado (requer JWT)
 */
export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        credits: true,
        totalGenerations: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
}
