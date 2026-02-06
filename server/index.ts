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
import { webhookHandler } from './routes/mp/webhooks';
import { healthCheck } from './routes/health';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
app.post('/api/mp/webhooks', webhookHandler);

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
