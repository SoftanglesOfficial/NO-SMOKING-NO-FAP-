import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield } from 'lucide-react-native';
import { GlowButton } from '../components/GlowButton';
import { colors, spacing, typography } from '../theme/colors';

interface OnboardingScreenProps {
  loading?: boolean;
  onComplete: (userName: string) => Promise<void>;
}

export function OnboardingScreen({
  loading = false,
  onComplete,
}: OnboardingScreenProps) {
  const [userName, setUserName] = useState('');
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    const trimmed = userName.trim();
    if (!trimmed) {
      return;
    }

    Keyboard.dismiss();
    await onComplete(trimmed);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      style={styles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.iconWrap}>
            <Shield size={40} color={colors.primary} strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>Welcome to Your Legacy</Text>
          <Text style={styles.subtitle}>
            Every warrior starts with a name. Claim yours and begin the journey.
          </Text>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Enter your name, Warrior</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              editable={!loading}
            />
          </View>

          <GlowButton
            label="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={!userName.trim()}
            style={styles.button}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  inputWrap: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  button: {
    width: '100%',
  },
});
