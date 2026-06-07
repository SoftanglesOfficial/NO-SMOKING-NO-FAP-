import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ActiveState } from '../components/ActiveState';
import { Challenge } from '../types/challenge';
import { colors, spacing } from '../theme/colors';
import { triggerImpact } from '../utils/platform';

interface ChallengeDetailScreenProps {
  challenge: Challenge;
  loading?: boolean;
  onBack: () => void;
  onBreakStreak: () => Promise<void>;
}

export function ChallengeDetailScreen({
  challenge,
  loading = false,
  onBack,
  onBreakStreak,
}: ChallengeDetailScreenProps) {
  const handleBack = async () => {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <ArrowLeft size={20} color={colors.textSecondary} strokeWidth={2.5} />
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <ActiveState
        challenge={challenge}
        onBreakStreak={onBreakStreak}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  backLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
