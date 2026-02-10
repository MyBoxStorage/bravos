/**
 * Express Server - BRAVOS BRASIL Backend
 * 
 * Integração com Mercado Pago Payments API
 * Suporte a PIX e Boleto
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPayment } from './routes/mp/create-payment';
import { createPreference } from './routes/mp/create-preference';
import { webhookHandler } from './routes/mp/webhooks';
import { healthCheck } from './routes/health';
import { shippingQuote } from './routes/shipping/quote';
import { createOrder } from './routes/checkout/create-order';
import { getOrder } from './routes/orders/get-order';
import { markMontink, validateAdminToken } from './routes/orders/mark-montink';
import { listAdminOrders, exportAdminOrder } from './routes/admin/orders';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Rate limiting simples em memória (por IP + rota)
 *
 * MVP-safe: sem dependências externas, apenas em memória do processo atual.
 */
type RateLimitEntry = {
  count: number;
  firstRequestAt: number;
};

const rateLimitStore: Record<string, RateLimitEntry> = {};

function createRouteRateLimiter(routeKey: string, maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';

      const key = `${ip}:${routeKey}`;
      const now = Date.now();
      const entry = rateLimitStore[key];

      if (!entry) {
        rateLimitStore[key] = { count: 1, firstRequestAt: now };
        return next();
      }

      const elapsed = now - entry.firstRequestAt;

      if (elapsed > windowMs) {
        // Reinicia janela
        rateLimitStore[key] = { count: 1, firstRequestAt: now };
        return next();
      }

      if (entry.count >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
      }

      entry.count += 1;
      return next();
    } catch {
      // Em caso de erro no limiter, não bloquear a requisição
      return next();
    }
  };
}

// Limiters específicos por rota
const rateLimitGetOrder = createRouteRateLimiter('GET:/api/orders', 60, 5 * 60 * 1000);
const rateLimitMarkMontink = createRouteRateLimiter('POST:/api/orders/mark-montink', 20, 5 * 60 * 1000);
const rateLimitAdminListOrders = createRouteRateLimiter('GET:/api/admin/orders', 30, 5 * 60 * 1000);
const rateLimitAdminExportOrder = createRouteRateLimiter(
  'GET:/api/admin/orders/export',
  30,
  5 * 60 * 1000
);

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', healthCheck);
app.post('/api/mp/create-payment', createPayment);
app.post('/api/mp/create-preference', createPreference);
app.post('/api/mp/webhooks', webhookHandler);
app.post('/api/shipping/quote', shippingQuote);
app.post('/api/checkout/create-order', createOrder);
app.get('/api/orders/:externalReference', rateLimitGetOrder, getOrder);
app.post(
  '/api/orders/:externalReference/mark-montink',
  validateAdminToken,
  rateLimitMarkMontink,
  markMontink
);
app.get(
  '/api/admin/orders',
  validateAdminToken,
  rateLimitAdminListOrders,
  listAdminOrders
);
app.get(
  '/api/admin/orders/:externalReference/export',
  validateAdminToken,
  rateLimitAdminExportOrder,
  exportAdminOrder
);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Mercado Pago integration ready`);
});

export default app;
