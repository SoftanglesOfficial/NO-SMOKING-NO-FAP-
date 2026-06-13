import { activeApp } from '../constants/app';

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type NotificationTemplate = (
  userName: string,
  days: number,
  challengeName: string,
) => string;

const PERSONALIZED_TEMPLATES: NotificationTemplate[] = [
  (userName, days, challengeName) =>
    `Hey ${userName}, Day ${days} of ${challengeName} is here! The world needs this version of you. Stay strong! 🔥`,
  (userName, days, challengeName) =>
    `Warrior ${userName}, your ${days}-day ${challengeName} streak is a shield. Don't let it break today! 🛡️`,
  (userName, days, challengeName) =>
    `Listen ${userName}, Day ${days} of ${challengeName} is where most people quit. But you are not most people. Keep going! 🚀`,
  (userName, days, challengeName) =>
    `${userName}, ${days} days into ${challengeName}. You didn't come this far to only come this far. Stay locked in! 💪`,
  (userName, days, challengeName) =>
    `Day ${days} of ${challengeName}, ${userName}. Tonight's discipline is tomorrow's freedom. You've got this! ✨`,
];

export function generatePersonalizedNotif(
  userName: string,
  days: number,
  challengeName: string = activeApp.challengeName,
): string {
  const name = userName.trim() || 'Warrior';
  const challenge = challengeName.trim() || activeApp.challengeName;
  const safeDays = Math.max(1, days);
  return pickRandom(PERSONALIZED_TEMPLATES)(name, safeDays, challenge);
}

export function getNotificationTitle(
  userName: string,
  appName: string = activeApp.appName,
): string {
  const name = userName.trim();
  return name ? `Stay Strong, ${name}` : appName;
}
