import React, { createContext, useContext, useReducer, useCallback, ReactNode, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { StepData } from '../types/models';
import { healthKit } from '../services/healthKit';
import { stepsApi } from '../api/steps';
import { notifyEmission } from '../services/notifications';

interface HealthState {
  todaySteps: StepData | null;
  weeklyHistory: StepData[];
  isSyncing: boolean;
  permissionGranted: boolean;
}

type HealthAction =
  | { type: 'SET_TODAY'; payload: StepData }
  | { type: 'SET_WEEKLY'; payload: StepData[] }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_PERMISSION'; payload: boolean };

const initialState: HealthState = {
  todaySteps: null,
  weeklyHistory: [],
  isSyncing: false,
  permissionGranted: false,
};

function healthReducer(state: HealthState, action: HealthAction): HealthState {
  switch (action.type) {
    case 'SET_TODAY':
      return { ...state, todaySteps: action.payload };
    case 'SET_WEEKLY':
      return { ...state, weeklyHistory: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'SET_PERMISSION':
      return { ...state, permissionGranted: action.payload };
    default:
      return state;
  }
}

interface HealthContextValue extends HealthState {
  syncSteps: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  fetchWeeklyHistory: () => Promise<void>;
  isOffline: boolean;
  hasConflict: { serverSteps: number; localSteps: number } | null;
  resolveConflict: (useLocal: boolean) => Promise<void>;
}

const HealthContext = createContext<HealthContextValue | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(healthReducer, initialState);
  const [isOffline, setIsOffline] = useState(false);
  const [hasConflict, setHasConflict] = useState<{ serverSteps: number; localSteps: number } | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const calculateGCEarned = (steps: number) => {
    const base = Math.floor(steps / 1000);
    const cap = isOffline ? 300 : 60; // 300 GC offline cap
    return Math.min(base, cap); 
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await healthKit.requestPermissions();
    dispatch({ type: 'SET_PERMISSION', payload: granted });
    return granted;
  }, []);

  const syncSteps = useCallback(async () => {
    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const data = await healthKit.getStepCountToday();
      const gcEarned = calculateGCEarned(data.steps);
      
      const stepData: StepData = {
        date: new Date().toISOString().split('T')[0],
        steps: data.steps,
        goal: 10000,
        goalMet: data.steps >= 10000,
        distance: data.distance,
        calories: data.calories,
        minutes: Math.floor(data.steps / 130),
        gcEarned: gcEarned,
      };
      dispatch({ type: 'SET_TODAY', payload: stepData });

      if (isOffline) {
        const pending = await AsyncStorage.getItem('pending_steps') || '0';
        const total = parseInt(pending) + data.steps;
        await AsyncStorage.setItem('pending_steps', total.toString());
      } else {
        if (data.steps > 0) {
          try {
            if (gcEarned > 0) notifyEmission(gcEarned);
            await stepsApi.sync(data.steps);
            
            const pending = await AsyncStorage.getItem('pending_steps');
            if (pending && parseInt(pending) > 0) {
              await stepsApi.sync(parseInt(pending));
              await AsyncStorage.removeItem('pending_steps');
            }
          } catch (e: any) {
            if (e.response?.status === 409) {
              setHasConflict({
                serverSteps: e.response.data.server_steps,
                localSteps: data.steps
              });
            }
          }
        }
      }
    } catch {
      // Handle sync error silently
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [isOffline]);

  const resolveConflict = useCallback(async (useLocal: boolean) => {
    if (!hasConflict) return;
    try {
      await stepsApi.resolve(useLocal ? hasConflict.localSteps : hasConflict.serverSteps);
      setHasConflict(null);
      syncSteps();
    } catch (e) {
      Alert.alert('Error', 'No se pudo resolver el conflicto.');
    }
  }, [hasConflict, syncSteps]);

  const fetchWeeklyHistory = useCallback(async () => {
    const today = new Date();
    const days: StepData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const data = await healthKit.getStepCount(date, date);
      const gcEarned = calculateGCEarned(data.steps);

      days.push({
        date: date.toISOString().split('T')[0],
        steps: data.steps,
        goal: 10000,
        goalMet: data.steps >= 10000,
        distance: data.distance,
        calories: data.calories,
        minutes: Math.floor(data.steps / 130),
        gcEarned: gcEarned,
      });
    }
    dispatch({ type: 'SET_WEEKLY', payload: days });
  }, [isOffline]);

  return (
    <HealthContext.Provider
      value={{ ...state, syncSteps, requestPermission, fetchWeeklyHistory, isOffline, hasConflict, resolveConflict }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthContext = (): HealthContextValue => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealthContext must be used within HealthProvider');
  }
  return context;
};
