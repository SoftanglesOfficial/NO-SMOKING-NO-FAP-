import Constants from 'expo-constants';
import {
  AppVariantConfig,
  DEFAULT_VARIANT,
  getVariantConfig,
} from '../../MasterConfig';

function resolveVariantSlug(): string {
  const extra = Constants.expoConfig?.extra as
    | { appVariant?: string }
    | undefined;

  return extra?.appVariant ?? DEFAULT_VARIANT;
}

export const activeApp: AppVariantConfig = getVariantConfig(resolveVariantSlug());

export const APP_DISPLAY_NAME = activeApp.appName;
export const CHALLENGE_NAME = activeApp.challengeName;
export const THEME_COLOR = activeApp.themeColor;
export const APP_VARIANT = activeApp.slug;

/** Short tag for greetings, e.g. "No Fap" → "FAP" */
export function getGreetingTag(challengeName: string = CHALLENGE_NAME): string {
  const stripped = challengeName.replace(/^No\s+/i, '').trim();
  return (stripped || challengeName).toUpperCase();
}
