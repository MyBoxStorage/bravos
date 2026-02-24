import { Request, Response } from 'express';
import { sendWelcomeCouponEmail } from '../../utils/email.js';
import { prisma } from '../../utils/prisma.js';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  source: z.enum(['website', 'popup']).default('website'),
});

export async function subscribeNewsletter(req: Request, res: Response) {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: 'Email inválido' });

  const { email, source } = result.data;
  const key = email.toLowerCase();

  // Verifica se já existe no banco
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: key },
  });

  if (existing) {
    return res.json({ success: true, message: 'Email já cadastrado' });
  }

  // Salva no banco
  await prisma.newsletterSubscriber.create({
    data: { email: key, source },
  });

  // Envia e-mail do cupom em background
  sendWelcomeCouponEmail(key).catch(err =>
    console.error('Erro ao enviar cupom newsletter:', err)
  );

  return res.json({ success: true, message: 'Cupom enviado!' });
}
