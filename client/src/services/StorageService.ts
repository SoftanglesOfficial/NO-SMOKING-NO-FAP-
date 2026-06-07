import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { Challenge, StoredChallenge } from '../types/challenge';

const STORAGE_KEY = '@fab_challenges_data';
const LEGACY_STORAGE_KEY = '@fab_challenge_data';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function calculateStreak(lastResetDate: string): number {
  const parsed = new Date(lastResetDate);
  if (Number.isNaN(parsed.getTime())) {
    return 0;
  }

  const today = startOfDay(new Date());
  const resetDay = startOfDay(parsed);
  return Math.max(0, differenceInCalendarDays(today, resetDay));
}

function toChallenge(stored: StoredChallenge): Challenge {
  return {
    ...stored,
    currentStreak: calculateStreak(stored.lastResetDate),
  };
}

function isValidStoredChallenge(value: unknown): value is StoredChallenge {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const challenge = value as Record<string, unknown>;

  return (
    typeof challenge.id === 'string' &&
    typeof challenge.name === 'string' &&
    challenge.name.trim().length > 0 &&
    typeof challenge.startDate === 'string' &&
    typeof challenge.lastResetDate === 'string' &&
    typeof challenge.isActive === 'boolean' &&
    typeof challenge.highestStreak === 'number' &&
    Number.isFinite(challenge.highestStreak)
  );
}

function migrateLegacySingleObject(
  parsed: Record<string, unknown>,
): StoredChallenge[] {
  const legacyName = parsed.challengeName ?? parsed.name;
  if (typeof legacyName !== 'string' || !legacyName.trim()) {
    return [];
  }

  const now = new Date().toISOString();
  const startDate =
    typeof parsed.startDate === 'string' ? parsed.startDate : now;
  const lastResetDate =
    typeof parsed.lastResetDate === 'string'
      ? parsed.lastResetDate
      : startDate;

  return [
    {
      id: generateId(),
      name: legacyName.trim(),
      startDate,
      lastResetDate,
      isActive: parsed.isActive !== false,
      highestStreak:
        typeof parsed.highestStreak === 'number' &&
        Number.isFinite(parsed.highestStreak)
          ? Math.max(0, parsed.highestStreak)
          : 0,
    },
  ];
}

function normalizeStoredChallenges(parsed: unknown): StoredChallenge[] {
  if (Array.isArray(parsed)) {
    return parsed.filter(isValidStoredChallenge);
  }

  if (parsed && typeof parsed === 'object') {
    return migrateLegacySingleObject(parsed as Record<string, unknown>).filter(
      isValidStoredChallenge,
    );
  }

  return [];
}

async function readStoredChallenges(): Promise<StoredChallenge[]> {
  const raw =
    (await AsyncStorage.getItem(STORAGE_KEY)) ??
    (await AsyncStorage.getItem(LEGACY_STORAGE_KEY));

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const challenges = normalizeStoredChallenges(parsed);

    if (challenges.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    return challenges;
  } catch {
    return [];
  }
}

async function writeStoredChallenges(
  challenges: StoredChallenge[],
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
}

export class StorageService {
  static async getChallenges(): Promise<Challenge[]> {
    const stored = await readStoredChallenges();
    return stored.map(toChallenge);
  }

  static async getActiveChallenges(): Promise<Challenge[]> {
    const challenges = await this.getChallenges();
    return challenges.filter((challenge) => challenge.isActive);
  }

  static async getChallengeById(id: string): Promise<Challenge | null> {
    const challenges = await this.getChallenges();
    return challenges.find((challenge) => challenge.id === id) ?? null;
  }

  static async addChallenge(name: string): Promise<Challenge> {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Challenge name is required');
    }

    const challenges = await readStoredChallenges();
    const now = new Date().toISOString();

    const stored: StoredChallenge = {
      id: generateId(),
      name: trimmed,
      startDate: now,
      lastResetDate: now,
      isActive: true,
      highestStreak: 0,
    };

    challenges.push(stored);
    await writeStoredChallenges(challenges);
    return toChallenge(stored);
  }

  static async breakStreak(id: string): Promise<Challenge> {
    const challenges = await readStoredChallenges();
    const index = challenges.findIndex((challenge) => challenge.id === id);

    if (index === -1) {
      throw new Error('Challenge not found');
    }

    const stored = challenges[index];
    if (!stored.isActive) {
      throw new Error('Challenge is not active');
    }

    const currentStreak = calculateStreak(stored.lastResetDate);
    if (currentStreak > stored.highestStreak) {
      stored.highestStreak = currentStreak;
    }

    stored.isActive = false;
    challenges[index] = stored;
    await writeStoredChallenges(challenges);
    return toChallenge(stored);
  }

  static async deleteChallenge(id: string): Promise<void> {
    const challenges = await readStoredChallenges();
    const next = challenges.filter((challenge) => challenge.id !== id);
    await writeStoredChallenges(next);
  }

  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEY, LEGACY_STORAGE_KEY]);
  }
}
