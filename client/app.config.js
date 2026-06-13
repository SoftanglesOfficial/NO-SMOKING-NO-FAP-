const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const BACKGROUND_COLOR = '#050505';
const EAS_PROJECT_ID = 'b1a30335-fcd2-4a99-9b68-e933974205fd';

function loadMasterConfigModule() {
  const filePath = path.join(__dirname, 'MasterConfig.ts');
  const source = fs.readFileSync(filePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });

  const module = { exports: {} };
  const run = new Function('exports', 'module', 'require', outputText);
  run(module.exports, module, require);
  return module.exports;
}

const {
  getVariantConfig,
  getAndroidPackage,
  getIosBundleId,
  getBrandingIconPath,
  getNotificationChannelId,
  DEFAULT_VARIANT,
} = loadMasterConfigModule();

function resolveAsset(relativePath) {
  const fullPath = path.join(__dirname, relativePath.replace(/^\.\//, ''));
  return fs.existsSync(fullPath) ? relativePath : null;
}

function resolveIcon(slug) {
  return (
    resolveAsset(getBrandingIconPath(slug)) ??
    resolveAsset('./assets/icon.png') ??
    './assets/icon.png'
  );
}

function resolveAdaptiveIcon(slug, filename) {
  const branded = `./assets/branding/${slug}/${filename}`;
  return resolveAsset(branded) ?? resolveAsset(`./assets/${filename}`);
}

module.exports = () => {
  const variant = process.env.APP_VARIANT || DEFAULT_VARIANT;
  const app = getVariantConfig(variant);
  const icon = resolveIcon(app.slug);
  const androidForeground =
    resolveAdaptiveIcon(app.slug, 'android-icon-foreground.png') ??
    './assets/android-icon-foreground.png';
  const androidBackground =
    resolveAdaptiveIcon(app.slug, 'android-icon-background.png') ??
    './assets/android-icon-background.png';
  const androidMonochrome =
    resolveAdaptiveIcon(app.slug, 'android-icon-monochrome.png') ??
    './assets/android-icon-monochrome.png';
  const splashImage =
    resolveAsset(`./assets/branding/${app.slug}/splash-icon.png`) ??
    './assets/splash-icon.png';

  return {
    expo: {
      name: app.appName,
      slug: app.slug,
      version: '1.0.0',
      orientation: 'portrait',
      icon,
      userInterfaceStyle: 'dark',
      projectId: EAS_PROJECT_ID,
      splash: {
        image: splashImage,
        resizeMode: 'contain',
        backgroundColor: BACKGROUND_COLOR,
      },
      ios: {
        bundleIdentifier: getIosBundleId(app.slug),
        supportsTablet: true,
      },
      android: {
        package: getAndroidPackage(app.slug),
        adaptiveIcon: {
          backgroundColor: BACKGROUND_COLOR,
          foregroundImage: androidForeground,
          backgroundImage: androidBackground,
          monochromeImage: androidMonochrome,
        },
        predictiveBackGestureEnabled: false,
        statusBar: {
          backgroundColor: BACKGROUND_COLOR,
          barStyle: 'light-content',
        },
      },
      web: {
        favicon: icon,
      },
      extra: {
        eas: {
          projectId: EAS_PROJECT_ID,
        },
        appVariant: app.slug,
        appName: app.appName,
        challengeName: app.challengeName,
        themeColor: app.themeColor,
      },
      plugins: [
        [
          'expo-notifications',
          {
            icon,
            color: app.themeColor,
            defaultChannel: getNotificationChannelId(app.slug),
            enableBackgroundRemoteNotifications: false,
          },
        ],
      ],
    },
  };
};
