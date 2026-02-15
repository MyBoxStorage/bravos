import type { Response } from 'express';
import { generateStampSchema } from './schemas.js';
import { prisma } from '../../utils/prisma.js';
import type { AuthRequest } from '../../types/auth.js';

const CACHE_DAYS = 7;

/**
 * POST /api/generate-stamp
 * Recebe imagem já gerada pelo frontend (consome 1 crédito)
 * Imagens ficam disponíveis por 7 DIAS e depois são apagadas
 */
export async function generateStamp(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const validation = generateStampSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: validation.error.issues,
      });
      return;
    }

    const { prompt, generatedImage } = validation.data;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, email: true },
    });

    if (!user || user.credits < 1) {
      res.status(403).json({
        error: 'Sem créditos disponíveis',
        credits: user?.credits || 0,
        message: 'Compre um produto para ganhar +5 créditos',
      });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_DAYS);

    const generation = await prisma.generation.create({
      data: {
        userId,
        prompt,
        uploadedImg: null,
        status: 'PENDING',
        expiresAt,
        isExpired: false,
      },
    });

    console.log(
      `🎨 Starting generation ${generation.id} for user ${user.email} (expires: ${expiresAt.toISOString()})`
    );

    // Frontend envia a imagem já gerada
    if (!generatedImage) {
      res.status(400).json({ error: 'Imagem não fornecida' });
      return;
    }

    // Atualizar geração como completa (imagem vem do frontend)
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: 'COMPLETED',
        imageUrl: generatedImage,
      },
    });

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 1 },
          totalGenerations: { increment: 1 },
        },
      }),
      prisma.creditLog.create({
        data: {
          userId,
          amount: -1,
          reason: 'GENERATION',
        },
      }),
    ]);

    console.log(
      `✅ Generation ${generation.id} completed. Credits: ${user.credits} → ${updatedUser.credits}`
    );

    res.json({
      success: true,
      image: generatedImage,
      generationId: generation.id,
      creditsRemaining: updatedUser.credits,
      expiresAt: expiresAt.toISOString(),
      expiresInDays: CACHE_DAYS,
      message:
        updatedUser.credits === 0
          ? 'Você usou todos os créditos! Compre um produto para ganhar +5.'
          : `${updatedUser.credits} créditos restantes`,
      warning: `⚠️ Esta imagem ficará disponível por ${CACHE_DAYS} dias e será automaticamente apagada em ${expiresAt.toLocaleDateString('pt-BR')}.`,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Generate stamp error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
