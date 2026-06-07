import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing } from '../theme/colors';
import {
  dangerButtonShadow,
  primaryButtonShadow,
  triggerImpact,
} from '../utils/platform';

type GlowButtonVariant = 'primary' | 'danger' | 'ghost';

interface GlowButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: GlowButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function GlowButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: GlowButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) {
      return;
    }

    await triggerImpact(
      variant === 'danger'
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium,
    );
    await onPress();
  };

  const variantStyles = {
    primary: [styles.primary, primaryButtonShadow()],
    danger: [styles.danger, dangerButtonShadow()],
    ghost: styles.ghost,
  };

  const textStyles = {
    primary: styles.primaryText,
    danger: styles.dangerText,
    ghost: styles.ghostText,
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      android_ripple={
        variant === 'ghost'
          ? { color: 'rgba(57, 255, 20, 0.12)' }
          : { color: 'rgba(0, 0, 0, 0.12)' }
      }
      style={({ pressed }) => [
        styles.base,
        ...(Array.isArray(variantStyles[variant])
          ? variantStyles[variant]
          : [variantStyles[variant]]),
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.primary : colors.background}
        />
      ) : (
        <Text style={[styles.label, textStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.dangerMuted,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: Platform.OS === 'ios' ? 0.82 : 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: colors.background,
  },
  dangerText: {
    color: colors.danger,
  },
  ghostText: {
    color: colors.textSecondary,
  },
});
