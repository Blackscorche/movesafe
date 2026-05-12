import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';

interface HealthData {
  steps: number;
  distance: number;
  calories: number;
}

const EMPTY: HealthData = { steps: 0, distance: 0, calories: 0 };

const PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [],
  },
};

const isAvailable = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (Platform.OS !== 'ios') return resolve(false);
    AppleHealthKit.isAvailable((err, available) => {
      resolve(!err && available);
    });
  });

const requestPermissions = (): Promise<boolean> =>
  new Promise((resolve) => {
    AppleHealthKit.initHealthKit(PERMISSIONS, (err) => {
      resolve(!err);
    });
  });

const getStepCount = (startDate: Date, endDate: Date = new Date()): Promise<HealthData> =>
  new Promise((resolve) => {
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    AppleHealthKit.getStepCount(options, (err, steps: HealthValue) => {
      if (err) return resolve(EMPTY);
      resolve({
        steps: Math.round(steps.value ?? 0),
        distance: 0,
        calories: 0,
      });
    });
  });

const getStepCountToday = (): Promise<HealthData> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getStepCount(today);
};

export const healthKit = {
  isAvailable,
  requestPermissions,
  getStepCount,
  getStepCountToday,
};