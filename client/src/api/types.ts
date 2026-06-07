export interface Challenge {
  deviceId: string;
  challengeName: string;
  startDate: string;
  lastResetDate: string;
  highestStreak: number;
  isActive: boolean;
  currentStreak: number;
}

export interface StartChallengePayload {
  deviceId: string;
  challengeName: string;
}

export interface BreakStreakPayload {
  deviceId: string;
}
