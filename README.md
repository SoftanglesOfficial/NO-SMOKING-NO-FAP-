# No Fap Challenge App

A premium standalone streak-tracking app built with Expo and React Native. All data lives on your device — no server required.

## User flow

1. **Onboarding** — Enter your name ("Welcome to Your Legacy")
2. **Challenge setup** — Activate the hardcoded **No Smoking Challenge**
3. **Streak screen** — Track days, break streak, view personal best

## Features

- **Local persistence** — AsyncStorage saves your name, challenge, and streak
- **Streak tracking** — Calculated on-device with `date-fns` every time the app opens
- **Personalized notifications** — Daily heads-up reminders using your name (9 AM, 8 PM, 9 PM)
- **Premium UI** — Deep black (#050505) with neon green (#39FF14) accents

## Quick start

```bash
cd client
npm install
npx expo start
```

## Production build (APK)

```bash
cd client
eas build --platform android --profile preview
```

## Data model

| Key | Field | Description |
|-----|-------|-------------|
| User | `userName` | Warrior name from onboarding |
| Challenge | `challengeName` | Always "No Smoking Challenge" |
| Challenge | `startDate` | When the challenge was activated |
| Challenge | `lastResetDate` | Used to calculate current streak |
| Challenge | `highestStreak` | Personal best record |
| Challenge | `isActive` | Whether the streak is running |

Streak formula: `today - lastResetDate` (calendar days)
