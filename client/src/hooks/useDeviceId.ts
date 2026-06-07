import { useCallback, useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '../services/DeviceService';

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeviceId = useCallback(async () => {
    console.log('[FAB Challenge] Fetching device ID...');
    setLoading(true);
    setError(null);

    try {
      const id = await getOrCreateDeviceId();
      console.log('[FAB Challenge] Device ID ready:', id);
      setDeviceId(id);
    } catch (err: unknown) {
      console.log('[FAB Challenge] Device ID fetch failed:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to get device ID',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeviceId();
  }, [loadDeviceId]);

  return { deviceId, loading, error, refresh: loadDeviceId };
}
