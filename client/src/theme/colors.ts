import { THEME_COLOR } from '../constants/app';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const int = Number.parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const colors = {
  background: '#050505',
  surface: '#0F0F0F',
  surfaceElevated: '#161616',
  primary: THEME_COLOR,
  primaryMuted: withAlpha(THEME_COLOR, 0.15),
  danger: '#FF3131',
  dangerMuted: 'rgba(255, 49, 49, 0.15)',
  text: '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted: '#5A5A5A',
  border: '#1F1F1F',
  glow: withAlpha(THEME_COLOR, 0.45),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  hero: 72,
  title: 28,
  subtitle: 16,
  body: 15,
  caption: 13,
};
