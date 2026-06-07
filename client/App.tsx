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
import { AppScreen, Challenge } from './src/types/challenge';
import { colors, spacing } from './src/theme/colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [screen, setScreen] = useState<AppScreen>('list');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.isActive),
    [challenges],
  );

  const selectedChallenge = useMemo(
    () =>
      selectedChallengeId
        ? (challenges.find((challenge) => challenge.id === selectedChallengeId) ??
          null)
        : null,
    [challenges, selectedChallengeId],
  );

  const syncNotifications = useCallback(async (items: Challenge[]) => {
    await NotificationService.syncReminders(items).catch(() => undefined);
  }, []);

  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await StorageService.getChallenges();
      setChallenges(data);
      await syncNotifications(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load challenges');
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  }, [syncNotifications]);

  useEffect(() => {
    loadChallenges().then(() => {
      NotificationService.requestPermissionsOnLaunch().catch(() => undefined);
    });
  }, [loadChallenges]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      StorageService.getChallenges()
        .then(async (data) => {
          setChallenges(data);
          await syncNotifications(data);

          if (selectedChallengeId) {
            const stillExists = data.some(
              (challenge) =>
                challenge.id === selectedChallengeId && challenge.isActive,
            );
            if (!stillExists) {
              setSelectedChallengeId(null);
              setScreen('list');
            }
          }
        })
        .catch(() => undefined);
    });

    return () => subscription.remove();
  }, [selectedChallengeId, syncNotifications]);

  const handleNavigate = useCallback((nextScreen: AppScreen) => {
    setScreen(nextScreen);
    if (nextScreen === 'list') {
      setSelectedChallengeId(null);
    }
  }, []);

  const handleSelectChallenge = useCallback((challenge: Challenge) => {
    setSelectedChallengeId(challenge.id);
    setScreen('detail');
  }, []);

  const handleAddChallenge = useCallback(
    async (name: string) => {
      setActionLoading(true);
      setError(null);

      try {
        const created = await StorageService.addChallenge(name);
        const next = await StorageService.getChallenges();
        setChallenges(next);
        await syncNotifications(next);
        setSelectedChallengeId(created.id);
        setScreen('detail');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to add challenge';
        setError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [syncNotifications],
  );

  const handleBreakStreak = useCallback(
    async (id: string) => {
      setActionLoading(true);
      setError(null);

      try {
        await StorageService.breakStreak(id);
        const next = await StorageService.getChallenges();
        setChallenges(next);
        await syncNotifications(next);
        setSelectedChallengeId(null);
        setScreen('list');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to break streak';
        setError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [syncNotifications],
  );

  const handleDeleteChallenge = useCallback(
    async (id: string) => {
      setActionLoading(true);
      setError(null);

      try {
        await StorageService.deleteChallenge(id);
        await NotificationService.cancelDailyReminder(id).catch(
          () => undefined,
        );

        const next = await StorageService.getChallenges();
        setChallenges(next);
        await syncNotifications(next);

        if (selectedChallengeId === id) {
          setSelectedChallengeId(null);
          setScreen('list');
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete challenge';
        setError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [selectedChallengeId, syncNotifications],
  );

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
            screen={screen}
            challenges={activeChallenges}
            selectedChallenge={selectedChallenge}
            actionLoading={actionLoading}
            error={error}
            onNavigate={handleNavigate}
            onSelectChallenge={handleSelectChallenge}
            onAddChallenge={handleAddChallenge}
            onBreakStreak={handleBreakStreak}
            onDeleteChallenge={handleDeleteChallenge}
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
