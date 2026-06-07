export interface Challenge {
  deviceId: string;
  challengeName: string;
  startDate: string;
  lastResetDate: string;
  highestStreak: number;
  isActive: boolean;
}

export interface ChallengeResponse extends Challenge {
  currentStreak: number;
}
