import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StepData } from '../../types/models';

interface StepsState {
  today: StepData | null;
  weekly: StepData[];
  isSyncing: boolean;
  permissionGranted: boolean;
}

const initialState: StepsState = {
  today: null,
  weekly: [],
  isSyncing: false,
  permissionGranted: false,
};

const stepsSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    setToday: (state, action: PayloadAction<StepData>) => {
      state.today = action.payload;
    },
    setWeekly: (state, action: PayloadAction<StepData[]>) => {
      state.weekly = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
  },
});

export const { setToday, setWeekly, setSyncing, setPermission } = stepsSlice.actions;
export default stepsSlice.reducer;
