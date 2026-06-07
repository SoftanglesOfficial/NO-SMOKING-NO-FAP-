import { useCallback, useEffect, useState } from 'react';
import * as challengeApi from '../api/client';
import { getApiErrorMessage } from '../api/client';
import { Challenge } from '../api/types';
import { NotificationService } from '../services/NotificationService';

interface UseChallengeOptions {
  deviceId: string | null;
}

export function useChallenge({ deviceId }: UseChallengeOptions) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    if (!deviceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await challengeApi.getChallenge(deviceId);

      if (data === null) {
        console.log('No active challenge found, showing setup screen');
        setChallenge(null);
        return;
      }

      setChallenge(data);

      if (data.isActive) {
        NotificationService.scheduleDailyReminder(
          data.challengeName,
          data.currentStreak,
        ).catch(() => undefined);
      }
    } catch (err: unknown) {
      console.log('[FAB Challenge] fetchChallenge failed:', err);
      setChallenge(null);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    if (deviceId) {
      fetchChallenge();
    } else {
      setLoading(false);
      setChallenge(null);
    }
  }, [deviceId, fetchChallenge]);

  const startChallenge = useCallback(
    async (challengeName: string) => {
      if (!deviceId) {
        return;
      }

      setActionLoading(true);
      setError(null);

      try {
        const data = await challengeApi.startChallenge({
          deviceId,
          challengeName,
        });
        setChallenge(data);
        NotificationService.scheduleDailyReminder(
          data.challengeName,
          data.currentStreak,
        ).catch(() => undefined);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err));
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [deviceId],
  );

  const breakStreak = useCallback(async () => {
    if (!deviceId) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const data = await challengeApi.breakStreak({ deviceId });
      setChallenge(data);
      NotificationService.cancelDailyReminder().catch(() => undefined);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [deviceId]);

  return {
    challenge,
    loading,
    actionLoading,
    error,
    startChallenge,
    breakStreak,
    refresh: fetchChallenge,
  };
}
