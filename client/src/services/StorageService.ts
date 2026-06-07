import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { Challenge, StoredChallenge } from '../types/challenge';

const STORAGE_KEY = '@fab_challenge_data';

function calculateStreak(lastResetDate: string): number {
  const today = startOfDay(new Date());
  const resetDay = startOfDay(new Date(lastResetDate));
  return Math.max(0, differenceInCalendarDays(today, resetDay));
}

function toChallenge(stored: StoredChallenge): Challenge {
  return {
    ...stored,
    currentStreak: calculateStreak(stored.lastResetDate),
  };
}

async function readStoredChallenge(): Promise<StoredChallenge | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredChallenge;
  } catch {
    return null;
  }
}

async function writeStoredChallenge(data: StoredChallenge): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export class StorageService {
  static async getChallenge(): Promise<Challenge | null> {
    const stored = await readStoredChallenge();
    if (!stored) {
      return null;
    }
    return toChallenge(stored);
  }

  static async startChallenge(challengeName: string): Promise<Challenge> {
    const trimmed = challengeName.trim();
    if (!trimmed) {
      throw new Error('Challenge name is required');
    }

    const existing = await readStoredChallenge();
    const now = new Date().toISOString();

    const stored: StoredChallenge = {
      challengeName: trimmed,
      startDate: now,
      lastResetDate: now,
      highestStreak: existing?.highestStreak ?? 0,
      isActive: true,
    };

    await writeStoredChallenge(stored);
    return toChallenge(stored);
  }

  static async breakStreak(): Promise<Challenge> {
    const stored = await readStoredChallenge();
    if (!stored) {
      throw new Error('No challenge found');
    }
    if (!stored.isActive) {
      throw new Error('Challenge is not active');
    }

    const currentStreak = calculateStreak(stored.lastResetDate);

    if (currentStreak > stored.highestStreak) {
      stored.highestStreak = currentStreak;
    }

    stored.isActive = false;
    await writeStoredChallenge(stored);
    return toChallenge(stored);
  }

  static async clearChallenge(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
