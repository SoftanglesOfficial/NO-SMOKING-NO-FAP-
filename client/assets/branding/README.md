# Branding assets (one folder per app variant)

Create a folder for **each slug** defined in `MasterConfig.ts`:

```
assets/branding/
├── no-fap/
│   └── icon.png                    (required)
├── no-junk-food/
│   └── icon.png
├── no-sugar/
│   └── icon.png
└── ... (one folder per slug)
```

## Required per variant

| File | Required | Notes |
|------|----------|-------|
| `icon.png` | Yes | 1024×1024 app icon |

## Optional per variant

| File | Notes |
|------|-------|
| `splash-icon.png` | Splash screen image |
| `android-icon-foreground.png` | Adaptive icon foreground |
| `android-icon-background.png` | Adaptive icon background |
| `android-icon-monochrome.png` | Monochrome adaptive icon |

If a branded file is missing, `app.config.js` falls back to `./assets/icon.png` (and default Android icons).

## Build a specific variant

```bash
APP_VARIANT=no-junk-food npx expo start
APP_VARIANT=no-junk-food eas build --platform android --profile preview
```
