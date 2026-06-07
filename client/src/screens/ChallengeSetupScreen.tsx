import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { GlowButton } from '../components/GlowButton';
import { PersonalBest } from '../components/PersonalBest';
import { APP_DISPLAY_NAME, CHALLENGE_NAME } from '../constants/app';
import { colors, spacing, typography } from '../theme/colors';

interface ChallengeSetupScreenProps {
  userName: string;
  highestStreak?: number;
  loading?: boolean;
  onActivate: () => Promise<void>;
}

export function ChallengeSetupScreen({
  userName,
  highestStreak = 0,
  loading = false,
  onActivate,
}: ChallengeSetupScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.greeting}>Ready, {userName}?</Text>
        <Text style={styles.subtitle}>
          Activate your challenge and start building your legacy one day at a
          time.
        </Text>

        <View style={styles.challengeCard}>
          <View style={styles.challengeIconWrap}>
            <Flame size={32} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.challengeLabel}>Your Challenge</Text>
          <Text style={styles.challengeName}>{CHALLENGE_NAME}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {highestStreak > 0 ? (
          <PersonalBest highestStreak={highestStreak} />
        ) : null}
        <GlowButton
          label="ACTIVATE CHALLENGE"
          onPress={onActivate}
          loading={loading}
          style={styles.button}
        />
        <Text style={styles.footerNote}>{APP_DISPLAY_NAME}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  greeting: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    maxWidth: 340,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  challengeIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  challengeLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  challengeName: {
    color: colors.primary,
    fontSize: typography.title,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
  footerNote: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
