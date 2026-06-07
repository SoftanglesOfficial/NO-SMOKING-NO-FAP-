import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { ChallengeCard } from '../components/ChallengeCard';
import { FabAddButton } from '../components/FabAddButton';
import { Challenge } from '../types/challenge';
import { colors, spacing, typography } from '../theme/colors';

interface ChallengeListScreenProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onAddChallenge: () => void;
  onDeleteChallenge: (challenge: Challenge) => void;
}

export function ChallengeListScreen({
  challenges,
  onSelectChallenge,
  onAddChallenge,
  onDeleteChallenge,
}: ChallengeListScreenProps) {
  const isEmpty = challenges.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Challenges</Text>
        <Text style={styles.subtitle}>
          {isEmpty
            ? 'Start your first streak today'
            : `${challenges.length} active ${
                challenges.length === 1 ? 'challenge' : 'challenges'
              }`}
        </Text>
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Sparkles size={36} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No active challenges yet</Text>
          <Text style={styles.emptyText}>
            Tap below to create your first streak and build your legacy.
          </Text>
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChallengeCard
              challenge={item}
              onPress={onSelectChallenge}
              onDelete={onDeleteChallenge}
            />
          )}
        />
      )}

      <View style={styles.footer}>
        <FabAddButton onPress={onAddChallenge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
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
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
