import { useState, useCallback, useEffect } from 'react';
import { useHealthContext } from '../context/HealthContext';
import { StepData } from '../types/models';
import { STEPS_DAILY_GOAL } from '../utils/constants';

export const useSteps = () => {
  const {
    todaySteps,
    weeklyHistory,
    isSyncing,
    permissionGranted,
    syncSteps,
    requestPermission,
    fetchWeeklyHistory,
  } = useHealthContext();

  const [goal, setGoal] = useState(STEPS_DAILY_GOAL);

  const stepsToday = todaySteps?.steps ?? 0;
  const goalMet = todaySteps?.goalMet ?? false;
  const percentage = Math.min(Math.round((stepsToday / goal) * 100), 100);
  const remaining = Math.max(goal - stepsToday, 0);

  const sync = useCallback(async () => {
    await syncSteps();
  }, [syncSteps]);

  const refreshWeekly = useCallback(async () => {
    await fetchWeeklyHistory();
  }, [fetchWeeklyHistory]);

  const updateGoal = useCallback((newGoal: number) => {
    setGoal(newGoal);
  }, []);

  return {
    stepsToday,
    goal,
    goalMet,
    percentage,
    remaining,
    todaySteps,
    weeklyHistory,
    isSyncing,
    permissionGranted,
    sync,
    refreshWeekly,
    updateGoal,
    requestPermission,
  };
};
