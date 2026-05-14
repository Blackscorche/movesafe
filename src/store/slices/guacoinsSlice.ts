import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuaCoinBalance, Transaction } from '../../types/models';

interface GuaCoinsState {
  balance: GuaCoinBalance | null;
  transactions: Transaction[];
  filter: string;
  pendingRating: { redemptionId: string; storeName: string } | null;
}

const initialState: GuaCoinsState = {
  balance: null,
  transactions: [],
  filter: 'todas',
  pendingRating: null,
};

const guacoinsSlice = createSlice({
  name: 'guacoins',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<GuaCoinBalance>) => {
      state.balance = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setPendingRating: (state, action: PayloadAction<{ redemptionId: string; storeName: string } | null>) => {
      state.pendingRating = action.payload;
    },
  },
});

export const { setBalance, setTransactions, setFilter, setPendingRating } = guacoinsSlice.actions;
export default guacoinsSlice.reducer;
