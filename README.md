# FAB Challenge

A streak-tracking mobile app with a NestJS backend and Expo React Native client.

## Stack

- **Backend** (`server/`) — NestJS, JSON file persistence, device-based identity
- **Client** (`client/`) — Expo, TypeScript, local evening notifications

## Quick start

### Backend

```bash
cd server
npm install
npm run start:dev
```

Runs at `http://localhost:3000`.

### Client

```bash
cd client
npm install
npx expo start
```

For a physical device, set `EXPO_PUBLIC_PHYSICAL_DEVICE_HOST` in `client/.env` to your machine's local IP.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/challenges/start` | Start a challenge |
| GET | `/challenges/:deviceId` | Get challenge + streak |
| POST | `/challenges/break` | Break streak, save personal best |
