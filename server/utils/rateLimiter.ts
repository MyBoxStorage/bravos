/**
 * Rate limiter abstraction (in-memory by default).
 * Structured so the store can be swapped (e.g. Redis) without changing route usage.
 */

import type { Request, Response, NextFunction } from 'express';

export type RateLimitEntry = {
  count: number;
  firstRequestAt: number;
};

/** Store interface: swap for Redis later without touching routes. */
export interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, entry: RateLimitEntry): void;
}

const defaultStore: RateLimitStore = (() => {
  const memory: Record<string, RateLimitEntry> = {};
  return {
    get(key) {
      return memory[key];
    },
    set(key, entry) {
      memory[key] = entry;
    },
  };
})();

export interface RateLimiterConfig {
  routeKey: string;
  maxRequests: number;
  windowMs: number;
  store?: RateLimitStore;
}

/**
 * Returns Express middleware that enforces rate limit per IP + routeKey.
 * Uses in-memory store unless config.store is provided (e.g. Redis-backed store later).
 */
export function createRateLimiter(
  config: RateLimiterConfig
): (req: Request, res: Response, next: NextFunction) => void {
  const { routeKey, maxRequests, windowMs, store = defaultStore } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';

      const key = `${ip}:${routeKey}`;
      const now = Date.now();
      const entry = store.get(key);

      if (!entry) {
        store.set(key, { count: 1, firstRequestAt: now });
        return next();
      }

      const elapsed = now - entry.firstRequestAt;

      if (elapsed > windowMs) {
        store.set(key, { count: 1, firstRequestAt: now });
        return next();
      }

      if (entry.count >= maxRequests) {
        res.status(429).json({ error: 'Too many requests' });
        return;
      }

      store.set(key, { ...entry, count: entry.count + 1 });
      next();
    } catch {
      next();
    }
  };
}
