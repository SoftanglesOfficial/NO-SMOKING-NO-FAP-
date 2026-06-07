import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme/colors';
import { streakCardShadow } from '../utils/platform';

interface StreakCounterProps {
  streak: number;
  name: string;
}

export function StreakCounter({ streak, name }: StreakCounterProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.ring, streakCardShadow()]}>
        <View style={styles.innerCircle}>
          <Flame size={32} color={colors.primary} strokeWidth={2} />
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? 'DAY' : 'DAYS'}
          </Text>
        </View>
      </View>
      <Text style={styles.challengeName}>{name.toUpperCase()}</Text>
    </View>
  );
}

const CIRCLE_SIZE = 240;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  ring: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryMuted,
  },
  innerCircle: {
    width: CIRCLE_SIZE - 24,
    height: CIRCLE_SIZE - 24,
    borderRadius: (CIRCLE_SIZE - 24) / 2,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  streakNumber: {
    color: colors.primary,
    fontSize: typography.hero,
    fontWeight: '900',
    lineHeight: typography.hero,
    includeFontPadding: false,
  },
  streakLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 3,
  },
  challengeName: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
});
