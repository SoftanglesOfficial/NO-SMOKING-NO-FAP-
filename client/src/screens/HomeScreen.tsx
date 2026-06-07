import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActiveState } from '../components/ActiveState';
import { EmptyState } from '../components/EmptyState';
import { GlowButton } from '../components/GlowButton';
import { PersonalBest } from '../components/PersonalBest';
import { Challenge } from '../api/types';
import { colors, spacing } from '../theme/colors';

interface HomeScreenProps {
  challenge: Challenge | null;
  actionLoading: boolean;
  onStartChallenge: (challengeName: string) => Promise<void>;
  onBreakStreak: () => Promise<void>;
  onRetry: () => void;
  networkError?: string | null;
}

export function HomeScreen({
  challenge,
  actionLoading,
  onStartChallenge,
  onBreakStreak,
  onRetry,
  networkError = null,
}: HomeScreenProps) {
  if (networkError && !challenge) {
    return (
      <View style={styles.flex}>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{networkError}</Text>
          <GlowButton label="Retry" onPress={onRetry} style={styles.retryButton} />
        </View>
      </View>
    );
  }

  const isActive = challenge?.isActive ?? false;

  return (
    <View style={styles.flex}>
      {isActive && challenge ? (
        <ActiveState
          challenge={challenge}
          onBreakStreak={onBreakStreak}
          loading={actionLoading}
        />
      ) : challenge && !isActive ? (
        <View style={styles.inactiveContainer}>
          <EmptyState onStart={onStartChallenge} loading={actionLoading} />
          <View style={styles.inactiveFooter}>
            <PersonalBest highestStreak={challenge.highestStreak} />
            <Text style={styles.inactiveHint}>
              Start a new challenge to beat your record
            </Text>
          </View>
        </View>
      ) : (
        <EmptyState onStart={onStartChallenge} loading={actionLoading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  retryButton: {
    width: '100%',
  },
  inactiveContainer: {
    flex: 1,
  },
  inactiveFooter: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  inactiveHint: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
