import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Flame, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Challenge } from '../types/challenge';
import { colors, spacing, typography } from '../theme/colors';
import { triggerImpact } from '../utils/platform';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
}

export function ChallengeCard({
  challenge,
  onPress,
  onDelete,
}: ChallengeCardProps) {
  const streakLabel = `${challenge.currentStreak} ${
    challenge.currentStreak === 1 ? 'Day' : 'Days'
  }`;

  const confirmDelete = () => {
    Alert.alert(
      'Delete Challenge?',
      `"${challenge.name}" will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(challenge),
        },
      ],
    );
  };

  const handleLongPress = async () => {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Heavy);
    confirmDelete();
  };

  const handleDeletePress = async () => {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    confirmDelete();
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPress(challenge)}
        onLongPress={handleLongPress}
        delayLongPress={450}
        style={({ pressed }) => [
          styles.mainPressable,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.iconWrap}>
          <Flame size={22} color={colors.primary} strokeWidth={2.2} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {challenge.name}
          </Text>
          <Text style={styles.streak}>{streakLabel}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={handleDeletePress}
        hitSlop={12}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
      >
        <Trash2 size={18} color={colors.textMuted} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: spacing.sm,
  },
  mainPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    gap: spacing.md,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  streak: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    backgroundColor: colors.dangerMuted,
  },
});
