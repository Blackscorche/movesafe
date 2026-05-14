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

export const notifyEmission = async (amount: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡GuaCoins recibidos! 🪙',
      body: `Has ganado ${amount} GC por tus pasos de hoy.`,
    },
    trigger: null,
  });
};

export const notifyExpiryWarning = async (amount: number, days: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Atención! GC por vencer ⚠️',
      body: `Tienes ${amount} GC que vencerán en ${days} días. ¡Canjéalos pronto!`,
    },
    trigger: null,
  });
};

export const notifyRedemptionConfirmed = async (storeName: string, amount: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Canje confirmado! ✅',
      body: `Tu canje en ${storeName} por ${amount} GC ha sido exitoso.`,
    },
    trigger: null,
  });
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Silently fail
  }
};
