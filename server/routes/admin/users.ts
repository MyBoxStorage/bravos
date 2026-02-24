import { Router, type Request, Response } from 'express';
import { sendError } from '../../utils/errorResponse.js';
import { prisma } from '../../utils/prisma.js';
import { CreditReason } from '@prisma/client';

const router = Router();

/** GET /api/admin/users — list with search & pagination */
export async function listUsers(req: Request, res: Response): Promise<void> {
  try {
    const search = (req.query.search as string)?.trim() || '';
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          emailVerified: true,
          credits: true,
          totalGenerations: true,
          createdAt: true,
          _count: { select: { purchasedOrders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        emailVerified: u.emailVerified,
        credits: u.credits,
        totalGenerations: u.totalGenerations,
        createdAt: u.createdAt,
        purchasedOrdersCount: u._count.purchasedOrders,
      })),
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('List users error:', error);
    sendError(res, req, 500, 'INTERNAL_ERROR', 'Erro ao listar usuários');
  }
}

/** GET /api/admin/users/:id — user + last 5 orders + last 5 credit logs */
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        purchasedOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            externalReference: true,
            status: true,
            total: true,
            createdAt: true,
          },
        },
        creditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            reason: true,
            adminNote: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      sendError(res, req, 404, 'NOT_FOUND', 'Usuário não encontrado');
      return;
    }
    const { passwordHash, verifyToken, verifyTokenExp, ...safe } = user;
    res.json({ user: safe });
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, req, 500, 'INTERNAL_ERROR', 'Erro ao buscar usuário');
  }
}

/** PATCH /api/admin/users/:id/credits — set credits and create CreditLog with difference */
export async function updateUserCredits(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const body = req.body as { credits?: number; reason?: string };
    const credits = typeof body.credits === 'number' ? body.credits : undefined;
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';

    if (credits === undefined || credits < 0) {
      sendError(res, req, 400, 'BAD_REQUEST', 'credits (número >= 0) é obrigatório');
      return;
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, credits: true } });
    if (!user) {
      sendError(res, req, 404, 'NOT_FOUND', 'Usuário não encontrado');
      return;
    }

    const diff = credits - user.credits;
    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { credits },
      }),
      ...(diff !== 0
        ? [
            prisma.creditLog.create({
              data: {
                userId: id,
                amount: diff,
                reason: CreditReason.ADMIN_ADJUST,
                adminNote: reason || null,
              },
            }),
          ]
        : []),
    ]);

    const updated = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        credits: true,
        totalGenerations: true,
        createdAt: true,
      },
    });
    res.json({ user: updated });
  } catch (error) {
    console.error('Update user credits error:', error);
    sendError(res, req, 500, 'INTERNAL_ERROR', 'Erro ao atualizar créditos');
  }
}

/** PATCH /api/admin/users/:id/block — use emailVerified: false = blocked */
export async function updateUserBlock(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const body = req.body as { blocked?: boolean };
    const blocked = body.blocked === true;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      sendError(res, req, 404, 'NOT_FOUND', 'Usuário não encontrado');
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { emailVerified: !blocked },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        credits: true,
        totalGenerations: true,
        createdAt: true,
      },
    });
    res.json({ user: updated });
  } catch (error) {
    console.error('Update user block error:', error);
    sendError(res, req, 500, 'INTERNAL_ERROR', 'Erro ao atualizar bloqueio');
  }
}

router.get('/', listUsers);
router.patch('/:id/credits', updateUserCredits);
router.patch('/:id/block', updateUserBlock);
router.get('/:id', getUser);

export default router;
