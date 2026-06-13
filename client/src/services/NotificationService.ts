import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Linking, Platform } from 'react-native';
import { activeApp } from '../constants/app';
import { getNotificationChannelId } from '../../MasterConfig';
import {
  configureLocalNotificationHandler,
  LocalNotifications,
} from './localNotifications';
import {
  generatePersonalizedNotif,
  getNotificationTitle,
} from './notificationContent';

const ANDROID_CHANNEL_ID = getNotificationChannelId(activeApp.slug);
const MORNING_REMINDER_ID = `${activeApp.slug}-daily-reminder-morning`;
const EVENING_REMINDER_8PM_ID = `${activeApp.slug}-daily-reminder-8pm`;
const EVENING_REMINDER_9PM_ID = `${activeApp.slug}-daily-reminder-9pm`;

export const DAILY_REMINDER_HOURS = [9, 20, 21] as const;

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'unsupported';

let notificationsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';
let handlerReady = false;

function logLabel(): string {
  return `[${activeApp.appName}]`;
}

function isAndroidEmulator(): boolean {
  return Platform.OS === 'android' && !Device.isDevice;
}

function canUseNotifications(): boolean {
  return notificationsAvailable && Platform.OS !== 'web';
}

function getStreakDayCount(currentStreak: number): number {
  return Math.max(1, currentStreak + 1);
}

function ensureHandlerConfigured(): void {
  if (handlerReady || !canUseNotifications()) {
    return;
  }

  try {
    configureLocalNotificationHandler();
    handlerReady = true;
  } catch (error) {
    console.log(`${logLabel()} Notification handler setup failed:`, error);
    notificationsAvailable = false;
  }
}

function buildNotificationContent(title: string, body: string) {
  return {
    title,
    body,
    sound: true,
    badge: 1,
    ...(Platform.OS === 'android'
      ? {
          channelId: ANDROID_CHANNEL_ID,
          priority: LocalNotifications.AndroidNotificationPriority.MAX,
          vibrate: [0, 300, 200, 300],
          color: activeApp.themeColor,
        }
      : {
          interruptionLevel: 'timeSensitive' as const,
        }),
  };
}

export class NotificationService {
  private static permissionStatus: NotificationPermissionStatus =
    'undetermined';

  static getPermissionStatus(): NotificationPermissionStatus {
    return this.permissionStatus;
  }

  static isSupported(): boolean {
    return canUseNotifications();
  }

  static isExpoGo(): boolean {
    return Constants.appOwnership === 'expo';
  }

  static async requestPermissionsOnLaunch(): Promise<NotificationPermissionStatus> {
    if (!canUseNotifications()) {
      this.permissionStatus = 'unsupported';
      return 'unsupported';
    }

    try {
      ensureHandlerConfigured();
      return await this.requestPermissions();
    } catch (error) {
      console.log(`${logLabel()} requestPermissionsOnLaunch failed:`, error);
      this.permissionStatus = 'unsupported';
      return 'unsupported';
    }
  }

  private static async ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android' || !canUseNotifications()) {
      return;
    }

    if (isAndroidEmulator()) {
      return;
    }

    try {
      await LocalNotifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: `${activeApp.appName} Alerts`,
        description:
          'Personalized daily reminders to keep your streak alive',
        importance: LocalNotifications.AndroidImportance.MAX,
        enableVibrate: true,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: activeApp.themeColor,
        sound: 'default',
        showBadge: true,
        bypassDnd: false,
        lockscreenVisibility:
          LocalNotifications.AndroidNotificationVisibility.PUBLIC,
      });
    } catch (error) {
      console.log(`${logLabel()} ensureAndroidChannel failed:`, error);
    }
  }

  static async requestPermissions(): Promise<NotificationPermissionStatus> {
    if (!canUseNotifications()) {
      this.permissionStatus = 'unsupported';
      return 'unsupported';
    }

    try {
      ensureHandlerConfigured();
      await this.ensureAndroidChannel();

      const existing = await LocalNotifications.getPermissionsAsync();

      if (existing.granted) {
        this.permissionStatus = 'granted';
        return 'granted';
      }

      if (
        Platform.OS === 'ios' &&
        existing.status === 'denied' &&
        existing.canAskAgain === false
      ) {
        this.permissionStatus = 'denied';
        return 'denied';
      }

      const requested = await LocalNotifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (requested.granted) {
        this.permissionStatus = 'granted';
        return 'granted';
      }

      if (
        Platform.OS === 'ios' &&
        requested.ios?.status ===
          LocalNotifications.IosAuthorizationStatus.PROVISIONAL
      ) {
        this.permissionStatus = 'granted';
        return 'granted';
      }

      if (
        Platform.OS === 'ios' &&
        requested.ios?.status ===
          LocalNotifications.IosAuthorizationStatus.AUTHORIZED
      ) {
        this.permissionStatus = 'granted';
        return 'granted';
      }

      this.permissionStatus = 'denied';
      return 'denied';
    } catch (error) {
      console.log(`${logLabel()} requestPermissions failed:`, error);
      this.permissionStatus = 'unsupported';
      return 'unsupported';
    }
  }

  static async openSystemSettings(): Promise<void> {
    await Linking.openSettings();
  }

  static async scheduleDailyReminder(
    userName: string,
    currentStreak: number,
  ): Promise<void> {
    if (!canUseNotifications()) {
      return;
    }

    try {
      ensureHandlerConfigured();

      const permission = await this.requestPermissions();
      if (permission !== 'granted') {
        return;
      }

      const dayCount = getStreakDayCount(currentStreak);
      const title = getNotificationTitle(userName);
      const challengeName = activeApp.challengeName;

      const schedules = [
        { id: MORNING_REMINDER_ID, hour: DAILY_REMINDER_HOURS[0] },
        { id: EVENING_REMINDER_8PM_ID, hour: DAILY_REMINDER_HOURS[1] },
        { id: EVENING_REMINDER_9PM_ID, hour: DAILY_REMINDER_HOURS[2] },
      ] as const;

      for (const schedule of schedules) {
        await LocalNotifications.cancelScheduledNotificationAsync(schedule.id);
      }

      for (const schedule of schedules) {
        const body = generatePersonalizedNotif(
          userName,
          dayCount,
          challengeName,
        );

        await LocalNotifications.scheduleNotificationAsync({
          identifier: schedule.id,
          content: buildNotificationContent(title, body),
          trigger: {
            type: LocalNotifications.SchedulableTriggerInputTypes.DAILY,
            hour: schedule.hour,
            minute: 0,
            channelId: ANDROID_CHANNEL_ID,
          },
        });
      }
    } catch (error) {
      console.log(`${logLabel()} scheduleDailyReminder failed:`, error);
    }
  }

  static async cancelDailyReminder(): Promise<void> {
    if (!canUseNotifications()) {
      return;
    }

    try {
      await LocalNotifications.cancelScheduledNotificationAsync(
        MORNING_REMINDER_ID,
      );
      await LocalNotifications.cancelScheduledNotificationAsync(
        EVENING_REMINDER_8PM_ID,
      );
      await LocalNotifications.cancelScheduledNotificationAsync(
        EVENING_REMINDER_9PM_ID,
      );
    } catch (error) {
      console.log(`${logLabel()} cancelDailyReminder failed:`, error);
    }
  }
}
