import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { StepData } from '../types/models';
import { healthKit } from '../services/healthKit';
import { stepsApi } from '../api/steps';

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
}

const HealthContext = createContext<HealthContextValue | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(healthReducer, initialState);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await healthKit.requestPermissions();
    dispatch({ type: 'SET_PERMISSION', payload: granted });
    return granted;
  }, []);

  const syncSteps = useCallback(async () => {
    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const data = await healthKit.getStepCountToday();
      const stepData: StepData = {
        date: new Date().toISOString().split('T')[0],
        steps: data.steps,
        goal: 10000,
        goalMet: data.steps >= 10000,
        distance: data.distance,
        calories: data.calories,
        minutes: Math.floor(data.steps / 130),
        gcEarned: data.steps >= 10000 ? 10 : 0,
      };
      dispatch({ type: 'SET_TODAY', payload: stepData });
      if (data.steps > 0) {
        await stepsApi.sync(data.steps);
      }
    } catch {
      // Handle sync error silently
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, []);

  const fetchWeeklyHistory = useCallback(async () => {
    const today = new Date();
    const days: StepData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const data = await healthKit.getStepCount(date, date);
      days.push({
        date: date.toISOString().split('T')[0],
        steps: data.steps,
        goal: 10000,
        goalMet: data.steps >= 10000,
        distance: data.distance,
        calories: data.calories,
        minutes: Math.floor(data.steps / 130),
        gcEarned: data.steps >= 10000 ? 10 : 0,
      });
    }
    dispatch({ type: 'SET_WEEKLY', payload: days });
  }, []);

  return (
    <HealthContext.Provider
      value={{ ...state, syncSteps, requestPermission, fetchWeeklyHistory }}
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
