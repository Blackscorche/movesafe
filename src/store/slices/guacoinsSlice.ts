import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuaCoinBalance, Transaction } from '../../types/models';

interface GuaCoinsState {
  balance: GuaCoinBalance | null;
  transactions: Transaction[];
  filter: string;
}

const initialState: GuaCoinsState = {
  balance: null,
  transactions: [],
  filter: 'todas',
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
  },
});

export const { setBalance, setTransactions, setFilter } = guacoinsSlice.actions;
export default guacoinsSlice.reducer;
