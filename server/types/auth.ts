import type { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  credits: number;
  name: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
