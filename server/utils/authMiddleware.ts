import jwt from 'jsonwebtoken';
import type { Response, NextFunction } from 'express';
import { prisma } from './prisma.js';
import type { AuthRequest, JWTPayload } from '../types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  WARNING: JWT_SECRET not set in production!');
}

/**
 * Middleware: Requer autenticação JWT
 * Adiciona req.user com dados do usuário autenticado
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        credits: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
}

/**
 * Gera token JWT para um usuário
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email } as JWTPayload, JWT_SECRET, { expiresIn: '30d' });
}
