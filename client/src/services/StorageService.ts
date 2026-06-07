import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { CHALLENGE_NAME } from '../constants/app';
import { Challenge, StoredChallenge } from '../types/challenge';

const USER_KEY = '@nfc_user_profile';
const CHALLENGE_KEY = '@nfc_challenge_data';

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
    typeof challenge.challengeName === 'string' &&
    typeof challenge.startDate === 'string' &&
    typeof challenge.lastResetDate === 'string' &&
    typeof challenge.isActive === 'boolean' &&
    typeof challenge.highestStreak === 'number' &&
    Number.isFinite(challenge.highestStreak)
  );
}

async function readStoredChallenge(): Promise<StoredChallenge | null> {
  try {
    const raw = await AsyncStorage.getItem(CHALLENGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidStoredChallenge(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function writeStoredChallenge(data: StoredChallenge): Promise<void> {
  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
}

export class StorageService {
  static async getUserName(): Promise<string | null> {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as { userName?: unknown };
      const name =
        typeof parsed.userName === 'string' ? parsed.userName.trim() : '';

      return name.length > 0 ? name : null;
    } catch {
      return null;
    }
  }

  static async saveUserName(userName: string): Promise<string> {
    const trimmed = userName.trim();
    if (!trimmed) {
      throw new Error('Name is required');
    }

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify({ userName: trimmed }),
    );
    return trimmed;
  }

  static async getChallenge(): Promise<Challenge | null> {
    const stored = await readStoredChallenge();
    if (!stored) {
      return null;
    }
    return toChallenge(stored);
  }

  static async activateChallenge(): Promise<Challenge> {
    const existing = await readStoredChallenge();
    const now = new Date().toISOString();

    const stored: StoredChallenge = {
      challengeName: CHALLENGE_NAME,
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

  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([USER_KEY, CHALLENGE_KEY]);
  }
}
