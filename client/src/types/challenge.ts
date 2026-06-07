export interface StoredChallenge {
  challengeName: string;
  startDate: string;
  lastResetDate: string;
  highestStreak: number;
  isActive: boolean;
}

export interface Challenge extends StoredChallenge {
  currentStreak: number;
}
