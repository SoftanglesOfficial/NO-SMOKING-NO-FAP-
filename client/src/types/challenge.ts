export interface StoredChallenge {
  id: string;
  name: string;
  startDate: string;
  lastResetDate: string;
  isActive: boolean;
  highestStreak: number;
}

export interface Challenge extends StoredChallenge {
  currentStreak: number;
}

export type AppScreen = 'list' | 'detail' | 'add';
