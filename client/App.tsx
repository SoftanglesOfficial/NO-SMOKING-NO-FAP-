import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotificationService } from './src/services/NotificationService';
import { StorageService } from './src/services/StorageService';
import { Challenge } from './src/types/challenge';
import { colors, spacing } from './src/theme/colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await StorageService.getChallenge();
      setChallenge(data);

      if (data?.isActive) {
        NotificationService.scheduleDailyReminder(
          data.challengeName,
          data.currentStreak,
        ).catch(() => undefined);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load challenge');
      setChallenge(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenge().then(() => {
      NotificationService.requestPermissionsOnLaunch().catch(() => undefined);
    });
  }, [loadChallenge]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      StorageService.getChallenge()
        .then((data) => {
          setChallenge(data);
          if (data?.isActive) {
            NotificationService.scheduleDailyReminder(
              data.challengeName,
              data.currentStreak,
            ).catch(() => undefined);
          }
        })
        .catch(() => undefined);
    });

    return () => subscription.remove();
  }, []);

  const handleStartChallenge = useCallback(async (challengeName: string) => {
    setActionLoading(true);
    setError(null);

    try {
      const data = await StorageService.startChallenge(challengeName);
      setChallenge(data);
      await NotificationService.scheduleDailyReminder(
        data.challengeName,
        data.currentStreak,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to start challenge';
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleBreakStreak = useCallback(async () => {
    setActionLoading(true);
    setError(null);

    try {
      const data = await StorageService.breakStreak();
      setChallenge(data);
      await NotificationService.cancelDailyReminder();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to break streak';
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

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
            error={error}
            onStartChallenge={handleStartChallenge}
            onBreakStreak={handleBreakStreak}
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
