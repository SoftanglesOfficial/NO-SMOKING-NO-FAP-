import { Platform, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

export async function triggerImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
): Promise<void> {
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics are unavailable on some simulators and web builds.
  }
}

export function streakCardShadow(): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 28,
    },
    android: {
      elevation: 18,
    },
    default: {},
  }) as ViewStyle;
}

export function primaryButtonShadow(): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
    },
    android: {
      elevation: 10,
    },
    default: {},
  }) as ViewStyle;
}

export function dangerButtonShadow(): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: colors.danger,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }) as ViewStyle;
}
