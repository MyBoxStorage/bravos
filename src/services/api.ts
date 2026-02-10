/**
 * Cliente HTTP para chamadas ao backend
 */

import { API_URL } from '@/config/api';

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

/**
 * Faz uma requisição GET ao backend
 */
export async function getJSON<T>(
  path: string,
  options?: { headers?: Record<string, string> }
): Promise<T> {
  const url = `${API_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        error: data.error || 'Request failed',
        message: data.message,
        details: data.details,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    // Se já é um ApiError, re-lança
    if (error && typeof error === 'object' && 'error' in error) {
      throw error;
    }
    
    // Erro de rede ou outro erro
    throw {
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiError;
  }
}

/**
 * Faz uma requisição POST JSON ao backend
 */
export async function postJSON<T>(
  path: string,
  body: any,
  options?: { headers?: Record<string, string> }
): Promise<T> {
  const url = `${API_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        error: data.error || 'Request failed',
        message: data.message,
        details: data.details,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    // Se já é um ApiError, re-lança
    if (error && typeof error === 'object' && 'error' in error) {
      throw error;
    }
    
    // Erro de rede ou outro erro
    throw {
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiError;
  }
}
