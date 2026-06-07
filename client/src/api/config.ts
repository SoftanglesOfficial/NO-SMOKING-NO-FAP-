import { Platform } from 'react-native';
import * as Device from 'expo-device';

const API_PORT = 3000;
const ANDROID_EMULATOR_URL = `http://10.0.2.2:${API_PORT}`;

/**
 * Resolves the backend URL for the current runtime:
 * - Android Emulator  → http://10.0.2.2:3000
 * - iOS Simulator     → http://localhost:3000
 * - Physical Device   → http://<EXPO_PUBLIC_PHYSICAL_DEVICE_HOST>:3000
 *
 * Set EXPO_PUBLIC_API_URL to override all detection logic.
 */
export function getApiBaseUrl(): string {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '');
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return ANDROID_EMULATOR_URL;
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    return `http://localhost:${API_PORT}`;
  }

  if (Device.isDevice) {
    const host = process.env.EXPO_PUBLIC_PHYSICAL_DEVICE_HOST?.trim();
    if (!host) {
      console.warn(
        '[FAB Challenge] Running on a physical device. Set EXPO_PUBLIC_PHYSICAL_DEVICE_HOST in .env to your machine IP (e.g. 192.168.1.42).',
      );
      return `http://192.168.1.1:${API_PORT}`;
    }
    return `http://${host}:${API_PORT}`;
  }

  if (Platform.OS === 'android') {
    return ANDROID_EMULATOR_URL;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = getApiBaseUrl();
