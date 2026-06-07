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
import { Sparkles } from 'lucide-react-native';
import { GlowButton } from './GlowButton';
import { colors, spacing, typography } from '../theme/colors';

interface EmptyStateProps {
  onStart: (challengeName: string) => Promise<void>;
  loading?: boolean;
}

export function EmptyState({ onStart, loading = false }: EmptyStateProps) {
  const [challengeName, setChallengeName] = useState('');
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    const trimmed = challengeName.trim();
    if (!trimmed) {
      return;
    }
    Keyboard.dismiss();
    await onStart(trimmed);
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
            <Sparkles size={40} color={colors.primary} strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>FAB Challenge</Text>
          <Text style={styles.subtitle}>
            Name your challenge. Build your legacy. One day at a time.
          </Text>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Challenge Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. No Sugar, Gym Daily, Read 30min"
              placeholderTextColor={colors.textMuted}
              value={challengeName}
              onChangeText={setChallengeName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleStart}
              editable={!loading}
            />
          </View>

          <GlowButton
            label="Start Your Legacy"
            onPress={handleStart}
            loading={loading}
            disabled={!challengeName.trim()}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
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
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
