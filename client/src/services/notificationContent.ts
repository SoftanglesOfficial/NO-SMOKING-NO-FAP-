const GENERIC_TEMPLATES = [
  (name: string, days: number) =>
    `Day ${days} of ${name}. You are becoming a version of yourself you've never met. Keep going! 🔥`,
  (name: string, days: number) =>
    `Boom! ${days} Days Clean! Your ${name} challenge is officially in God-mode. 🚀`,
  (name: string, days: number) =>
    `Don't quit now. You didn't come this far to only come this far. Day ${days} of ${name} starts now!`,
  (name: string, days: number) =>
    `Standard is the new average. Day ${days} of ${name}. Stay FAB. ✨`,
  (name: string, days: number) =>
    `${days} days deep into ${name}. The old you is watching — prove them wrong tonight. 💪`,
  (name: string, days: number) =>
    `Day ${days} of ${name}. This is where champions are made. One more night. One more win. 🏆`,
];

const CHALLENGE_SPECIFIC: Array<{
  match: (name: string) => boolean;
  templates: Array<(name: string, days: number) => string>;
}> = [
  {
    match: (name) => /smok/i.test(name),
    templates: [
      (name, days) =>
        `Day ${days} smoke-free. Every craving you beat is rewriting your lungs and your legacy. 🌬️`,
      (name, days) =>
        `${days} days without ${name}. Breathe deep — you're taking your life back. 🔥`,
      (_, days) =>
        `The urge hits hardest at night. Day ${days} — you are stronger than the cigarette. Don't break now.`,
    ],
  },
  {
    match: (name) => /sugar|sweet|junk|fast food/i.test(name),
    templates: [
      (name, days) =>
        `Day ${days} of ${name}. Your discipline is louder than the craving. Stay clean. 🍃`,
      (_, days) =>
        `${days} days clean. That late-night snack doesn't own you — you do. ✨`,
    ],
  },
  {
    match: (name) => /gym|workout|exercise|fitness|run/i.test(name),
    templates: [
      (name, days) =>
        `Day ${days} of ${name}. Rest is earned — but quitting isn't an option. Move tomorrow. 🏋️`,
      (_, days) =>
        `${days} days in. Your future self is already stronger because you didn't skip today.`,
    ],
  },
  {
    match: (name) => /read|book|study|learn/i.test(name),
    templates: [
      (name, days) =>
        `Day ${days} of ${name}. One page tonight keeps the streak — and your mind — sharp. 📚`,
      (_, days) =>
        `${days} days of showing up. Knowledge compounds. Don't break the chain tonight.`,
    ],
  },
  {
    match: (name) => /alcohol|drink|sober/i.test(name),
    templates: [
      (name, days) =>
        `Day ${days} of ${name}. Clear mind. Clear choices. You're building something real. 🌟`,
      (_, days) =>
        `${days} days sober. Tonight's temptation is tomorrow's regret. You've come too far.`,
    ],
  },
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getMotivationalMessage(
  challengeName: string,
  days: number,
): string {
  const name = challengeName.trim() || 'Your Challenge';
  const safeDays = Math.max(1, days);

  const matched = CHALLENGE_SPECIFIC.find((entry) => entry.match(name));
  const specificPool = matched?.templates ?? [];
  const pool =
    specificPool.length > 0
      ? [...specificPool, ...GENERIC_TEMPLATES]
      : GENERIC_TEMPLATES;

  return pickRandom(pool)(name, safeDays);
}

export function getNotificationTitle(challengeName: string): string {
  const name = challengeName.trim();
  return name ? `${name} · FAB Challenge` : 'FAB Challenge';
}
