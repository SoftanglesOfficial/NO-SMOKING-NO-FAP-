import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { AppFlow, Challenge } from './src/types/challenge';
import { colors, spacing } from './src/theme/colors';

function resolveFlow(
  userName: string | null,
  challenge: Challenge | null,
): AppFlow {
  if (!userName) {
    return 'onboarding';
  }

  if (!challenge?.isActive) {
    return 'setup';
  }

  return 'streak';
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flow = useMemo(
    () => resolveFlow(userName, challenge),
    [userName, challenge],
  );

  const syncNotifications = useCallback(
    async (name: string | null, data: Challenge | null) => {
      if (name && data?.isActive) {
        await NotificationService.scheduleDailyReminder(
          name,
          data.currentStreak,
        );
      } else {
        await NotificationService.cancelDailyReminder();
      }
    },
    [],
  );

  const loadAppState = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [name, data] = await Promise.all([
        StorageService.getUserName(),
        StorageService.getChallenge(),
      ]);

      setUserName(name);
      setChallenge(data);
      await syncNotifications(name, data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load app data');
      setUserName(null);
      setChallenge(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncNotifications]);

  useEffect(() => {
    loadAppState().then(() => {
      NotificationService.requestPermissionsOnLaunch().catch(() => undefined);
    });
  }, [loadAppState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      Promise.all([
        StorageService.getUserName(),
        StorageService.getChallenge(),
      ])
        .then(async ([name, data]) => {
          setUserName(name);
          setChallenge(data);
          await syncNotifications(name, data);
        })
        .catch(() => undefined);
    });

    return () => subscription.remove();
  }, [syncNotifications]);

  const handleSaveUserName = useCallback(async (name: string) => {
    setActionLoading(true);
    setError(null);

    try {
      const saved = await StorageService.saveUserName(name);
      setUserName(saved);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to save your name';
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleActivateChallenge = useCallback(async () => {
    setActionLoading(true);
    setError(null);

    try {
      const data = await StorageService.activateChallenge();
      setChallenge(data);
      await syncNotifications(userName, data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to activate challenge';
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [syncNotifications, userName]);

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
            flow={flow}
            userName={userName}
            challenge={challenge}
            actionLoading={actionLoading}
            error={error}
            onSaveUserName={handleSaveUserName}
            onActivateChallenge={handleActivateChallenge}
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
