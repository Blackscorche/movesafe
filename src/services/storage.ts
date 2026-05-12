import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HAS_ONBOARDED: '@movesave/has_onboarded',
  HEALTH_PERMISSION_GRANTED: '@movesave/health_permission',
  USER_PREFERENCES: '@movesave/preferences',
  LAST_SYNC_DATE: '@movesave/last_sync',
};

export const storage = {
  // Onboarding
  setHasOnboarded: (value: boolean) =>
    AsyncStorage.setItem(KEYS.HAS_ONBOARDED, JSON.stringify(value)),

  getHasOnboarded: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(KEYS.HAS_ONBOARDED);
    return value ? JSON.parse(value) : false;
  },

  // Health permission
  setHealthPermissionGranted: (value: boolean) =>
    AsyncStorage.setItem(KEYS.HEALTH_PERMISSION_GRANTED, JSON.stringify(value)),

  getHealthPermissionGranted: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(KEYS.HEALTH_PERMISSION_GRANTED);
    return value ? JSON.parse(value) : false;
  },

  // User preferences
  setPreferences: (prefs: Record<string, unknown>) =>
    AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(prefs)),

  getPreferences: async (): Promise<Record<string, unknown> | null> => {
    const value = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
    return value ? JSON.parse(value) : null;
  },

  // Last sync date
  setLastSyncDate: (date: string) =>
    AsyncStorage.setItem(KEYS.LAST_SYNC_DATE, date),

  getLastSyncDate: async (): Promise<string | null> => {
    return AsyncStorage.getItem(KEYS.LAST_SYNC_DATE);
  },

  // Generic
  clear: () => AsyncStorage.multiRemove(Object.values(KEYS)),
};
