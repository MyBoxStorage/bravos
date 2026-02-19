import type { Request, Response } from 'express';
import { prisma } from '../../utils/prisma.js';
import { generateVerifyToken } from '../../utils/emailVerification.js';
import { sendVerificationEmail } from '../../utils/email.js';

/**
 * POST /api/auth/resend-verification
 * Reenvia o código de verificação por e-mail para um usuário pendente.
 */
export async function resendVerification(req: Request, res: Response): Promise<void> {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: 'userId obrigatório' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  if (user.emailVerified) {
    res.status(400).json({ error: 'E-mail já verificado' });
    return;
  }

  const verifyToken = generateVerifyToken();
  const verifyTokenExp = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: { verifyToken, verifyTokenExp },
  });

  sendVerificationEmail({
    name: user.name || 'Cliente',
    email: user.email,
    token: verifyToken,
  }).catch(err => console.error('Erro ao reenviar email:', err));

  res.json({ success: true, message: 'Código reenviado' });
}
