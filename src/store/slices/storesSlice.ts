import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store, Coupon } from '../../types/models';

interface StoresState {
  stores: Store[];
  selectedStore: Store | null;
  coupons: Coupon[];
  favorites: Store[];
  category: string;
  searchQuery: string;
}

const initialState: StoresState = {
  stores: [],
  selectedStore: null,
  coupons: [],
  favorites: [],
  category: 'Todos',
  searchQuery: '',
};

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    setSelectedStore: (state, action: PayloadAction<Store | null>) => {
      state.selectedStore = action.payload;
    },
    setCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.coupons = action.payload;
    },
    setFavorites: (state, action: PayloadAction<Store[]>) => {
      state.favorites = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const store = state.stores.find((s) => s.id === action.payload);
      if (store) {
        store.isFavorite = !store.isFavorite;
      }
      if (state.selectedStore?.id === action.payload) {
        state.selectedStore.isFavorite = !state.selectedStore.isFavorite;
      }
    },
  },
});

export const {
  setStores,
  setSelectedStore,
  setCoupons,
  setFavorites,
  setCategory,
  setSearchQuery,
  toggleFavorite,
} = storesSlice.actions;
export default storesSlice.reducer;
