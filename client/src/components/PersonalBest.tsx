import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme/colors';

interface PersonalBestProps {
  highestStreak: number;
}

export function PersonalBest({ highestStreak }: PersonalBestProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={16} color={colors.primary} strokeWidth={2.5} />
        <Text style={styles.label}>Personal Best</Text>
      </View>
      <Text style={styles.value}>
        {highestStreak} {highestStreak === 1 ? 'DAY' : 'DAYS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.primary,
    fontSize: typography.title,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
