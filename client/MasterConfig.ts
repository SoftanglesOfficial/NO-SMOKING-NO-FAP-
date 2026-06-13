/**
 * Master white-label registry for all challenge app variants.
 *
 * Add new entries to VARIANT_LIST, then create:
 *   ./assets/branding/<slug>/icon.png
 *
 * Build / run with:
 *   APP_VARIANT=no-junk-food npx expo start
 *   APP_VARIANT=no-junk-food eas build --platform android
 */

export interface AppVariantConfig {
  slug: string;
  appName: string;
  challengeName: string;
  themeColor: string;
}

export const DEFAULT_VARIANT = 'no-fap';

const VARIANT_LIST: AppVariantConfig[] = [
  {
    slug: 'no-fap',
    appName: 'No Fap Challenge App',
    challengeName: 'No Fap',
    themeColor: '#39FF14',
  },
  {
    slug: 'no-smoking',
    appName: 'No Smoking Challenge App',
    challengeName: 'No Smoking',
    themeColor: '#39FF14',
  },
  {
    slug: 'no-junk-food',
    appName: 'No Junk Food Challenge',
    challengeName: 'No Junk Food',
    themeColor: '#FF4500',
  },
  {
    slug: 'no-sugar',
    appName: 'No Sugar Challenge',
    challengeName: 'No Sugar',
    themeColor: '#FF69B4',
  },
  {
    slug: 'no-alcohol',
    appName: 'No Alcohol Challenge',
    challengeName: 'No Alcohol',
    themeColor: '#00CED1',
  },
  {
    slug: 'no-caffeine',
    appName: 'No Caffeine Challenge',
    challengeName: 'No Caffeine',
    themeColor: '#8B4513',
  },
  {
    slug: 'no-fast-food',
    appName: 'No Fast Food Challenge',
    challengeName: 'No Fast Food',
    themeColor: '#FF6347',
  },
  {
    slug: 'no-soda',
    appName: 'No Soda Challenge',
    challengeName: 'No Soda',
    themeColor: '#1E90FF',
  },
  {
    slug: 'no-weed',
    appName: 'No Weed Challenge',
    challengeName: 'No Weed',
    themeColor: '#32CD32',
  },
  {
    slug: 'no-vaping',
    appName: 'No Vaping Challenge',
    challengeName: 'No Vaping',
    themeColor: '#9370DB',
  },
  {
    slug: 'no-social-media',
    appName: 'No Social Media Challenge',
    challengeName: 'No Social Media',
    themeColor: '#00BFFF',
  },
  {
    slug: 'no-tiktok',
    appName: 'No TikTok Challenge',
    challengeName: 'No TikTok',
    themeColor: '#EE1D52',
  },
  {
    slug: 'no-instagram',
    appName: 'No Instagram Challenge',
    challengeName: 'No Instagram',
    themeColor: '#E1306C',
  },
  {
    slug: 'no-youtube',
    appName: 'No YouTube Challenge',
    challengeName: 'No YouTube',
    themeColor: '#FF0000',
  },
  {
    slug: 'no-netflix',
    appName: 'No Netflix Challenge',
    challengeName: 'No Netflix',
    themeColor: '#E50914',
  },
  {
    slug: 'no-gaming',
    appName: 'No Gaming Challenge',
    challengeName: 'No Gaming',
    themeColor: '#7B68EE',
  },
  {
    slug: 'no-shopping',
    appName: 'No Shopping Challenge',
    challengeName: 'No Shopping',
    themeColor: '#FFD700',
  },
  {
    slug: 'no-late-snacks',
    appName: 'No Late Snacks Challenge',
    challengeName: 'No Late Snacks',
    themeColor: '#FFA500',
  },
  {
    slug: 'no-nail-biting',
    appName: 'No Nail Biting Challenge',
    challengeName: 'No Nail Biting',
    themeColor: '#F08080',
  },
  {
    slug: 'no-procrastination',
    appName: 'No Procrastination Challenge',
    challengeName: 'No Procrastination',
    themeColor: '#20B2AA',
  },
  {
    slug: 'no-anger',
    appName: 'No Anger Challenge',
    challengeName: 'No Anger',
    themeColor: '#DC143C',
  },
  {
    slug: 'gym-daily',
    appName: 'Gym Daily Challenge',
    challengeName: 'Gym Daily',
    themeColor: '#39FF14',
  },
  {
    slug: 'morning-run',
    appName: 'Morning Run Challenge',
    challengeName: 'Morning Run',
    themeColor: '#FF8C00',
  },
  {
    slug: 'walk-daily',
    appName: 'Walk Daily Challenge',
    challengeName: 'Walk Daily',
    themeColor: '#3CB371',
  },
  {
    slug: 'meditation-daily',
    appName: 'Meditation Daily Challenge',
    challengeName: 'Meditation Daily',
    themeColor: '#BA55D3',
  },
  {
    slug: 'read-daily',
    appName: 'Read Daily Challenge',
    challengeName: 'Read Daily',
    themeColor: '#4682B4',
  },
  {
    slug: 'study-daily',
    appName: 'Study Daily Challenge',
    challengeName: 'Study Daily',
    themeColor: '#5F9EA0',
  },
  {
    slug: 'journal-daily',
    appName: 'Journal Daily Challenge',
    challengeName: 'Journal Daily',
    themeColor: '#DDA0DD',
  },
  {
    slug: 'pray-daily',
    appName: 'Pray Daily Challenge',
    challengeName: 'Pray Daily',
    themeColor: '#FFD700',
  },
  {
    slug: 'sleep-early',
    appName: 'Sleep Early Challenge',
    challengeName: 'Sleep Early',
    themeColor: '#6A5ACD',
  },
  {
    slug: 'cold-shower',
    appName: 'Cold Shower Challenge',
    challengeName: 'Cold Shower',
    themeColor: '#00FFFF',
  },
  {
    slug: 'water-daily',
    appName: 'Water Daily Challenge',
    challengeName: 'Water Daily',
    themeColor: '#1E90FF',
  },
  {
    slug: 'save-money-daily',
    appName: 'Save Money Daily Challenge',
    challengeName: 'Save Money Daily',
    themeColor: '#2E8B57',
  },
  {
    slug: 'no-negative-self-talk',
    appName: 'No Negative Self Talk Challenge',
    challengeName: 'No Negative Self Talk',
    themeColor: '#FF1493',
  },
  // --- Add remaining variants below (target: 160+ total) ---
];

export const MASTER_CONFIG: Record<string, AppVariantConfig> = Object.fromEntries(
  VARIANT_LIST.map((variant) => [variant.slug, variant]),
);

export type AppVariantSlug = keyof typeof MASTER_CONFIG;

export function getVariantConfig(
  variant: string = process.env.APP_VARIANT ?? DEFAULT_VARIANT,
): AppVariantConfig {
  return MASTER_CONFIG[variant] ?? MASTER_CONFIG[DEFAULT_VARIANT];
}

export function getAndroidPackage(slug: string): string {
  const safe = slug.replace(/-/g, '');
  return `com.challenge.${safe}`;
}

export function getIosBundleId(slug: string): string {
  return getAndroidPackage(slug);
}

export function getBrandingDir(slug: string): string {
  return `./assets/branding/${slug}`;
}

export function getBrandingIconPath(slug: string): string {
  return `${getBrandingDir(slug)}/icon.png`;
}

export function getNotificationChannelId(slug: string): string {
  return `${slug}-heads-up`;
}
