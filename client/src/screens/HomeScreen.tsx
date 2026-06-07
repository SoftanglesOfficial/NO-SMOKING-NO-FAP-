import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { ChallengeListScreen } from './ChallengeListScreen';
import { ChallengeDetailScreen } from './ChallengeDetailScreen';
import { AddChallengeScreen } from './AddChallengeScreen';
import { AppScreen, Challenge } from '../types/challenge';
import { colors, spacing } from '../theme/colors';

interface HomeScreenProps {
  screen: AppScreen;
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  actionLoading: boolean;
  error?: string | null;
  onNavigate: (screen: AppScreen) => void;
  onSelectChallenge: (challenge: Challenge) => void;
  onAddChallenge: (name: string) => Promise<void>;
  onBreakStreak: (id: string) => Promise<void>;
  onDeleteChallenge: (id: string) => Promise<void>;
}

export function HomeScreen({
  screen,
  challenges,
  selectedChallenge,
  actionLoading,
  error = null,
  onNavigate,
  onSelectChallenge,
  onAddChallenge,
  onBreakStreak,
  onDeleteChallenge,
}: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const previousScreen = useRef<AppScreen>(screen);

  useEffect(() => {
    if (previousScreen.current === screen) {
      return;
    }

    fadeAnim.setValue(0);
    slideAnim.setValue(screen === 'list' ? -16 : 16);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    previousScreen.current = screen;
  }, [fadeAnim, screen, slideAnim]);

  const content = (() => {
    if (screen === 'add') {
      return (
        <AddChallengeScreen
          loading={actionLoading}
          onBack={() => onNavigate('list')}
          onAddChallenge={onAddChallenge}
        />
      );
    }

    if (screen === 'detail' && selectedChallenge) {
      return (
        <ChallengeDetailScreen
          challenge={selectedChallenge}
          loading={actionLoading}
          onBack={() => onNavigate('list')}
          onBreakStreak={() => onBreakStreak(selectedChallenge.id)}
        />
      );
    }

    return (
      <ChallengeListScreen
        challenges={challenges}
        onSelectChallenge={onSelectChallenge}
        onAddChallenge={() => onNavigate('add')}
        onDeleteChallenge={(challenge) => onDeleteChallenge(challenge.id)}
      />
    );
  })();

  return (
    <View style={styles.flex}>
      <Animated.View
        style={[
          styles.flex,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {content}
      </Animated.View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
