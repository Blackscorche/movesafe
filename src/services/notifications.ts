import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const setupNotifications = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'MoveSave',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return true;
  } catch {
    return false;
  }
};

export const scheduleDailyReminder = async (): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-reminder',
      content: {
        title: '¡No pierdas tu racha!',
        body: 'Te faltan pasos para cumplir tu meta diaria. ¡Vamos, tú puedes!',
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
  } catch {
    // Silently fail
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Silently fail
  }
};
