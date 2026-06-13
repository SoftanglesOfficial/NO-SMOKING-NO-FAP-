import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { GlowButton } from './GlowButton';
import { PersonalBest } from './PersonalBest';
import { StreakCounter } from './StreakCounter';
import { CHALLENGE_NAME, getGreetingTag } from '../constants/app';
import { colors, spacing, typography } from '../theme/colors';
import { Challenge } from '../types/challenge';

interface ActiveStateProps {
  userName: string;
  challenge: Challenge;
  onBreakStreak: () => Promise<void>;
  loading?: boolean;
}

export function ActiveState({
  userName,
  challenge,
  onBreakStreak,
  loading = false,
}: ActiveStateProps) {
  const confirmBreak = () => {
    Alert.alert(
      'Are you sure?',
      'This will end your current streak. Your personal best will be saved.',
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
      <Text style={styles.greeting}>
        Stay {getGreetingTag()}, {userName}
      </Text>

      <View style={styles.main}>
        <Text style={styles.header}>{CHALLENGE_NAME}</Text>
        <StreakCounter
          streak={challenge.currentStreak}
          challengeName={CHALLENGE_NAME}
        />
      </View>

      <View style={styles.footer}>
        <GlowButton
          label="I Broke My Streak"
          onPress={confirmBreak}
          variant="danger"
          loading={loading}
          style={styles.breakButton}
        />
        <PersonalBest highestStreak={challenge.highestStreak} />
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
  greeting: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
    textAlign: 'center',
  },
  footer: {
    gap: spacing.md,
  },
  breakButton: {
    width: '100%',
  },
});
