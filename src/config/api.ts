/**
 * Configuração da API Backend
 *
 * URL base do backend para chamadas de API
 */

export const API_URL = import.meta.env.VITE_API_URL || '';

export const apiConfig = {
  baseURL: API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://bravosbackend.fly.dev'),
};

if (!import.meta.env.DEV && !API_URL) {
  console.warn(
    'VITE_API_URL is not configured. Falling back to bravosbackend.fly.dev'
  );
}
