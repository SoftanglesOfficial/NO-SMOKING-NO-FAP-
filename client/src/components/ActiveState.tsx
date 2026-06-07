import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { GlowButton } from './GlowButton';
import { PersonalBest } from './PersonalBest';
import { StreakCounter } from './StreakCounter';
import { colors, spacing, typography } from '../theme/colors';
import { Challenge } from '../types/challenge';

interface ActiveStateProps {
  challenge: Challenge;
  onBreakStreak: () => Promise<void>;
  loading?: boolean;
}

export function ActiveState({
  challenge,
  onBreakStreak,
  loading = false,
}: ActiveStateProps) {
  const confirmBreak = () => {
    Alert.alert(
      'Are you sure?',
      'This will end your current challenge. Your personal best will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Break Streak',
          style: 'destructive',
          onPress: () => {
            onBreakStreak().catch(() => undefined);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.header}>Your Streak</Text>
        <StreakCounter
          streak={challenge.currentStreak}
          name={challenge.name}
        />
      </View>

      <View style={styles.footer}>
        <PersonalBest highestStreak={challenge.highestStreak} />
        <GlowButton
          label="I Broke My Streak"
          onPress={confirmBreak}
          variant="danger"
          loading={loading}
          style={styles.breakButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xl,
  },
  footer: {
    gap: spacing.md,
  },
  breakButton: {
    width: '100%',
  },
});
