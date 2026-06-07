import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActiveState } from '../components/ActiveState';
import { ChallengeSetupScreen } from './ChallengeSetupScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { AppFlow, Challenge } from '../types/challenge';
import { colors, spacing } from '../theme/colors';

interface HomeScreenProps {
  flow: AppFlow;
  userName: string | null;
  challenge: Challenge | null;
  actionLoading: boolean;
  error?: string | null;
  onSaveUserName: (userName: string) => Promise<void>;
  onActivateChallenge: () => Promise<void>;
  onBreakStreak: () => Promise<void>;
}

export function HomeScreen({
  flow,
  userName,
  challenge,
  actionLoading,
  error = null,
  onSaveUserName,
  onActivateChallenge,
  onBreakStreak,
}: HomeScreenProps) {
  return (
    <View style={styles.flex}>
      {flow === 'onboarding' ? (
        <OnboardingScreen
          loading={actionLoading}
          onComplete={onSaveUserName}
        />
      ) : flow === 'setup' && userName ? (
        <ChallengeSetupScreen
          userName={userName}
          highestStreak={challenge?.highestStreak ?? 0}
          loading={actionLoading}
          onActivate={onActivateChallenge}
        />
      ) : flow === 'streak' && userName && challenge?.isActive ? (
        <ActiveState
          userName={userName}
          challenge={challenge}
          onBreakStreak={onBreakStreak}
          loading={actionLoading}
        />
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
