import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  breakStreak as breakStreakApi,
  getApiErrorMessage,
  getChallenge,
  startChallenge as startChallengeApi,
} from './src/api/client';
import { Challenge } from './src/api/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { getOrCreateDeviceId } from './src/services/DeviceService';
import { NotificationService } from './src/services/NotificationService';
import { colors, spacing } from './src/theme/colors';

const MANUAL_DEVICE_ID = 'manual-device-123';
const DEVICE_ID_TIMEOUT_MS = 2000;
const EMERGENCY_TIMEOUT_MS = 5000;

async function resolveDeviceId(): Promise<string> {
  try {
    const id = await Promise.race([
      getOrCreateDeviceId(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Device ID timeout')),
          DEVICE_ID_TIMEOUT_MS,
        ),
      ),
    ]);
    return id;
  } catch {
    return MANUAL_DEVICE_ID;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    setNetworkError(null);

    const emergencyTimer = setTimeout(() => {
      setIsLoading(false);
    }, EMERGENCY_TIMEOUT_MS);

    try {
      const id = await resolveDeviceId();
      setDeviceId(id);

      const data = await getChallenge(id);

      if (data === null) {
        setChallenge(null);
      } else {
        setChallenge(data);
        if (data.isActive) {
          NotificationService.scheduleDailyReminder(
            data.challengeName,
            data.currentStreak,
          ).catch(() => undefined);
        }
      }
    } catch (err: unknown) {
      setNetworkError(
        getApiErrorMessage(err) ||
          (err instanceof Error ? err.message : 'Something went wrong'),
      );
      setChallenge(null);
    } finally {
      clearTimeout(emergencyTimer);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap().then(() => {
      NotificationService.requestPermissionsOnLaunch().catch(() => undefined);
    });
  }, [bootstrap]);

  const handleStartChallenge = useCallback(
    async (challengeName: string) => {
      if (!deviceId) {
        return;
      }

      setActionLoading(true);
      try {
        const data = await startChallengeApi({ deviceId, challengeName });
        setChallenge(data);
        setNetworkError(null);
        NotificationService.scheduleDailyReminder(
          data.challengeName,
          data.currentStreak,
        ).catch(() => undefined);
      } catch (err: unknown) {
        setNetworkError(getApiErrorMessage(err) || 'Failed to start challenge');
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [deviceId],
  );

  const handleBreakStreak = useCallback(async () => {
    if (!deviceId) {
      return;
    }

    setActionLoading(true);
    try {
      const data = await breakStreakApi({ deviceId });
      setChallenge(data);
      setNetworkError(null);
      NotificationService.cancelDailyReminder().catch(() => undefined);
    } catch (err: unknown) {
      setNetworkError(getApiErrorMessage(err) || 'Failed to break streak');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [deviceId]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading your legacy...</Text>
          </View>
        ) : (
          <HomeScreen
            challenge={challenge}
            actionLoading={actionLoading}
            onStartChallenge={handleStartChallenge}
            onBreakStreak={handleBreakStreak}
            onRetry={bootstrap}
            networkError={networkError}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
