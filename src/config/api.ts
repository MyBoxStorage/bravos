/**
 * Configuração da API Backend
 *
 * URL base do backend para chamadas de API
 */

export const API_URL = import.meta.env.VITE_API_URL || '';

if (!import.meta.env.DEV && !API_URL) {
  console.warn(
    'VITE_API_URL is not configured. Falling back to same-origin /api.'
  );
}
