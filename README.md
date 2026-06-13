# Challenge App Monorepo (White-Label)

One codebase powers 160+ standalone challenge apps. Each variant is configured in `client/MasterConfig.ts` and built with `APP_VARIANT`.

## White-label architecture

| File | Purpose |
|------|---------|
| `client/MasterConfig.ts` | Registry of all app variants (`slug`, `appName`, `challengeName`, `themeColor`) |
| `client/app.config.js` | Reads `APP_VARIANT` and applies name, package, icon, theme |
| `client/src/constants/app.ts` | Runtime config injected via Expo `extra` |
| `client/assets/branding/<slug>/` | Per-app icons and splash assets |

## Run / build a variant

```bash
cd client

# Default variant (no-fap)
npx expo start

# Specific variant
APP_VARIANT=no-junk-food npx expo start
APP_VARIANT=no-junk-food eas build --platform android --profile preview
```

## Branding folders (required)

For **each slug** in `MasterConfig.ts`, create:

```
client/assets/branding/<slug>/icon.png
```

Example:

```
client/assets/branding/no-fap/icon.png
client/assets/branding/no-junk-food/icon.png
client/assets/branding/no-sugar/icon.png
```

See `client/assets/branding/README.md` for optional splash and Android adaptive icons.

## Add a new app

1. Add an entry to `VARIANT_LIST` in `MasterConfig.ts`
2. Create `assets/branding/<slug>/icon.png`
3. Build with `APP_VARIANT=<slug> eas build ...`

## User flow (all variants)

1. **Onboarding** — Enter name
2. **Setup** — Activate hardcoded `challengeName` for that variant
3. **Streak** — Track days, break streak, personal best

All data stored locally via AsyncStorage. No backend.
