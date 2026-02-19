import { useEffect, useRef, useCallback } from 'react';
import { apiConfig } from '@/config/api';

interface OrderEvent {
  type: 'connected' | 'status_update';
  status?: string;
}

export function useOrderEvents(
  externalReference: string | null,
  email: string | null,
  onStatusChange: (status: string) => void
) {
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!externalReference || !email) return;
    const url = `${apiConfig.baseURL}/api/orders/${encodeURIComponent(externalReference)}/events?email=${encodeURIComponent(email)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const event: OrderEvent = JSON.parse(e.data);
        if (event.type === 'status_update' && event.status) {
          onStatusChange(event.status);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      setTimeout(connect, 5000);
    };
  }, [externalReference, email, onStatusChange]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
