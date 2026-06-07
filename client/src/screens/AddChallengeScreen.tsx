import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowButton } from '../components/GlowButton';
import { colors, spacing, typography } from '../theme/colors';
import { triggerImpact } from '../utils/platform';

interface AddChallengeScreenProps {
  loading?: boolean;
  onBack: () => void;
  onAddChallenge: (name: string) => Promise<void>;
}

export function AddChallengeScreen({
  loading = false,
  onBack,
  onAddChallenge,
}: AddChallengeScreenProps) {
  const [challengeName, setChallengeName] = useState('');
  const insets = useSafeAreaInsets();

  const handleBack = async () => {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  const handleAdd = async () => {
    const trimmed = challengeName.trim();
    if (!trimmed) {
      return;
    }

    Keyboard.dismiss();
    await onAddChallenge(trimmed);
    setChallengeName('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      style={styles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <ArrowLeft
              size={20}
              color={colors.textSecondary}
              strokeWidth={2.5}
            />
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>

          <View style={styles.form}>
            <Text style={styles.title}>New Challenge</Text>
            <Text style={styles.subtitle}>
              Name it. Commit to it. Track your streak day by day.
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
                onSubmitEditing={handleAdd}
                editable={!loading}
                autoFocus
              />
            </View>

            <GlowButton
              label="Start Challenge"
              onPress={handleAdd}
              loading={loading}
              disabled={!challengeName.trim()}
              style={styles.button}
            />
          </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  backLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  inputWrap: {
    width: '100%',
    marginBottom: spacing.sm,
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
