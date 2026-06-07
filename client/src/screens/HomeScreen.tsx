import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActiveState } from '../components/ActiveState';
import { EmptyState } from '../components/EmptyState';
import { PersonalBest } from '../components/PersonalBest';
import { Challenge } from '../types/challenge';
import { colors, spacing } from '../theme/colors';

interface HomeScreenProps {
  challenge: Challenge | null;
  actionLoading: boolean;
  error?: string | null;
  onStartChallenge: (challengeName: string) => Promise<void>;
  onBreakStreak: () => Promise<void>;
}

export function HomeScreen({
  challenge,
  actionLoading,
  error = null,
  onStartChallenge,
  onBreakStreak,
}: HomeScreenProps) {
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  errorText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
