/**
 * Local-only notification APIs — deep imports avoid expo-notifications/index.js
 * which registers push token listeners and crashes Expo Go on Android (SDK 53+).
 */
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { AndroidImportance, AndroidNotificationVisibility } from 'expo-notifications/build/NotificationChannelManager.types';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { IosAuthorizationStatus } from 'expo-notifications/build/NotificationPermissions.types';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  AndroidNotificationPriority,
  SchedulableTriggerInputTypes,
} from 'expo-notifications/build/Notifications.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

let handlerConfigured = false;

export function configureLocalNotificationHandler(): void {
  if (handlerConfigured) {
    return;
  }

  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: AndroidNotificationPriority.MAX,
    }),
  });

  handlerConfigured = true;
}

export const LocalNotifications = {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  AndroidImportance,
  AndroidNotificationPriority,
  AndroidNotificationVisibility,
  IosAuthorizationStatus,
  SchedulableTriggerInputTypes,
};
