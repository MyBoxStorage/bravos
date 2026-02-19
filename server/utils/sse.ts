/**
 * SSE (Server-Sent Events) para notificações de status do pedido em tempo real.
 * Clientes conectam em GET /api/orders/:externalReference/events?email=...
 * O webhook chama notifyOrderStatusChange para enviar atualizações.
 */

import type { Request, Response } from 'express';

const sseClients = new Map<string, Set<Response>>();

export function orderEventsHandler(req: Request, res: Response): void {
  const { externalReference } = req.params;
  const { email } = req.query as { email?: string };
  if (!email) {
    res.status(400).json({ error: 'email obrigatório' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  const key = `${externalReference}:${String(email).toLowerCase()}`;
  if (!sseClients.has(key)) sseClients.set(key, new Set());
  sseClients.get(key)!.add(res);

  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.get(key)?.delete(res);
  });
}

export function notifyOrderStatusChange(
  externalReference: string,
  payerEmail: string,
  status: string
): void {
  const key = `${externalReference}:${payerEmail.toLowerCase()}`;
  const clients = sseClients.get(key);
  if (!clients) return;
  const data = JSON.stringify({ type: 'status_update', status });
  clients.forEach((client) => {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      // cliente desconectado
    }
  });
}
