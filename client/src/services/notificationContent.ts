function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const PERSONALIZED_TEMPLATES = [
  (userName: string, days: number) =>
    `Hey ${userName}! You are ${days} days clean from Smoking. The world needs this version of you. Stay strong! 🔥`,
  (userName: string, days: number) =>
    `Warrior ${userName}, your ${days}-day streak is a shield. Don't let it break today! 🛡️`,
  (userName: string, days: number) =>
    `Listen ${userName}, Day ${days} is where most people quit. But you are not most people. Keep going! 🚀`,
];

export function generatePersonalizedNotif(
  userName: string,
  days: number,
): string {
  const name = userName.trim() || 'Warrior';
  const safeDays = Math.max(1, days);
  return pickRandom(PERSONALIZED_TEMPLATES)(name, safeDays);
}

export function getNotificationTitle(userName: string): string {
  const name = userName.trim();
  return name ? `Stay Strong, ${name}` : 'No Fap Challenge';
}
