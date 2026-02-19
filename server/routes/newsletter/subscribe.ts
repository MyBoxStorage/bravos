import { Request, Response } from 'express';
import { sendWelcomeCouponEmail } from '../../utils/email.js';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

const recentEmails = new Set<string>();

export async function subscribeNewsletter(req: Request, res: Response) {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: 'Email inválido' });

  const { email } = result.data;
  const key = email.toLowerCase();

  if (recentEmails.has(key)) {
    return res.json({ success: true, message: 'Email já cadastrado' });
  }

  recentEmails.add(key);
  setTimeout(() => recentEmails.delete(key), 24 * 60 * 60 * 1000);

  sendWelcomeCouponEmail(email).catch(err =>
    console.error('Erro ao enviar cupom newsletter:', err)
  );

  return res.json({ success: true, message: 'Cupom enviado!' });
}
