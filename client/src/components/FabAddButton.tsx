import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing } from '../theme/colors';
import { primaryButtonShadow, triggerImpact } from '../utils/platform';

interface FabAddButtonProps {
  onPress: () => void;
}

export function FabAddButton({ onPress }: FabAddButtonProps) {
  const handlePress = async () => {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.fab,
        primaryButtonShadow(),
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Plus size={22} color={colors.background} strokeWidth={3} />
        <Text style={styles.label}>Add New Challenge</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
