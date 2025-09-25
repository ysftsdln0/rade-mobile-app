import { useEffect, useRef, useState } from 'react';
import { monitoringProvider, ServerMetricSnapshot } from '../services/external/MonitoringProvider';

interface UseServerMonitoringOptions {
  serverId: string;
  live?: boolean;
  intervalMs?: number;
  historyWindowMs?: number; // default: last hour
}

export const useServerMonitoring = (options: UseServerMonitoringOptions) => {
  const { serverId, live = true, intervalMs = 5000, historyWindowMs = 3600000 } = options;
  const [latest, setLatest] = useState<ServerMetricSnapshot | null>(null);
  const [history, setHistory] = useState<ServerMetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const streamRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    const from = now - historyWindowMs;

    (async () => {
      try {
        setLoading(true);
        const hist = await monitoringProvider.getHistory(serverId, from, now);
        if (!cancelled) setHistory(hist);
        const last = await monitoringProvider.getLatest(serverId);
        if (!cancelled) setLatest(last);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    if (live) {
      streamRef.current = monitoringProvider.stream(serverId, {
        intervalMs,
        onData: (snap) => {
          setLatest(snap);
          setHistory((prev) => [...prev.slice(-59), snap]);
        },
      });
    }

    return () => {
      cancelled = true;
      streamRef.current?.stop();
    };
  }, [serverId, live, intervalMs, historyWindowMs]);

  return { latest, history, loading };
};
