import type { Response } from 'express';
import { prisma } from '../../utils/prisma.js';
import type { AuthRequest } from '../../types/auth.js';

/**
 * GET /api/user/my-generations
 * Lista gerações do usuário autenticado
 */
export async function getMyGenerations(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const generations = await prisma.generation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        prompt: true,
        imageUrl: true,
        status: true,
        isExpired: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      generations,
    });
  } catch (error) {
    console.error('Get my generations error:', error);
    res.status(500).json({ error: 'Erro ao buscar gerações' });
  }
}
