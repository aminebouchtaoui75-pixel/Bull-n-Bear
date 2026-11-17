import {useEffect, useState} from 'react';
import type {MarketQuote} from '../types/trading';

export type StreamStatus = 'connecting' | 'live' | 'reconnecting';

export function useMarketStream() {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  useEffect(() => {
    let active = true;
    let eventSource: EventSource | null = null;
    let pollTimer: number | null = null;

    const applyQuotes = (list: MarketQuote[]) => {
      if (!active || !Array.isArray(list)) return;
      const map: Record<string, MarketQuote> = {};
      for (const q of list) {
        map[q.symbol] = q;
      }
      setQuotes(map);
      setLastUpdated(Date.now());
      setStatus('live');
    };

    const fetchOnce = async () => {
      try {
        const res = await fetch('/api/market/quotes');
        if (res.ok) {
          const data = (await res.json()) as {quotes: MarketQuote[]};
          applyQuotes(data.quotes);
        }
      } catch {
        if (active) setStatus('reconnecting');
      }
    };

    void fetchOnce();

    try {
      eventSource = new EventSource('/api/market/stream');
      eventSource.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data) as MarketQuote[];
          applyQuotes(parsed);
        } catch {
          // ignore malformed tick
        }
      };
      eventSource.onerror = () => {
        if (!active) return;
        setStatus('reconnecting');
        if (!pollTimer) {
          pollTimer = window.setInterval(() => {
            void fetchOnce();
          }, 3000);
        }
      };
    } catch {
      pollTimer = window.setInterval(() => {
        void fetchOnce();
      }, 2000);
    }

    return () => {
      active = false;
      eventSource?.close();
      if (pollTimer) window.clearInterval(pollTimer);
    };
  }, []);

  return {quotes, status, lastUpdated};
}
