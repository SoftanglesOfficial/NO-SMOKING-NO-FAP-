# FAB Challenge

A standalone streak-tracking mobile app built with Expo and React Native. All data lives on your device — no server required.

## Features

- **Local persistence** — AsyncStorage saves your challenge, streak, and personal best
- **Streak tracking** — Calculated on-device with `date-fns` every time the app opens
- **Evening reminders** — Personalized motivational notifications at 8 PM & 9 PM
- **Premium FAB UI** — Neon dark theme, haptics, glowing streak counter

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

Or for production:

```bash
eas build --platform android --profile production
```

## Data model

Stored locally on device:

| Field | Description |
|-------|-------------|
| `challengeName` | Name of your challenge |
| `startDate` | When the challenge began |
| `lastResetDate` | Used to calculate current streak |
| `highestStreak` | Personal best record |
| `isActive` | Whether a challenge is in progress |

Streak formula: `today - lastResetDate` (calendar days)
