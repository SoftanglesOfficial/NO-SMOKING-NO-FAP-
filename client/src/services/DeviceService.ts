import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const DEVICE_ID_KEY = '@fab_challenge_device_id';

function buildDeviceFingerprint(): string {
  const parts = [
    Device.brand ?? 'unknown',
    Device.modelName ?? 'unknown',
    Device.osName ?? 'unknown',
    Device.osVersion ?? 'unknown',
    Device.osBuildId ?? Device.osInternalBuildId ?? 'unknown',
  ];

  return parts.join('-').replace(/\s+/g, '_').toLowerCase();
}

function generateFallbackId(): string {
  return `fab_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    return stored;
  }

  const fingerprint = buildDeviceFingerprint();
  const deviceId =
    fingerprint !== 'unknown-unknown-unknown-unknown-unknown'
      ? `device_${fingerprint}`
      : generateFallbackId();

  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}
