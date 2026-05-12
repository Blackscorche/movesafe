import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stepsReducer from './slices/stepsSlice';
import guacoinsReducer from './slices/guacoinsSlice';
import storesReducer from './slices/storesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    steps: stepsReducer,
    guacoins: guacoinsReducer,
    stores: storesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
