import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrderHistoryState = {
  orders: TOrder[];
  error: null | string;
  loading: boolean;
};

const initialState: TOrderHistoryState = {
  orders: [],
  error: null,
  loading: false
};

export const ordersHistory = createAsyncThunk(
  'user/orderHistory',
  getOrdersApi
);

export const ordersHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ordersHistory.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(ordersHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(ordersHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error order history';
      });
  },
  selectors: {
    getOrdersLoading: (state) => state.loading,
    getError: (state) => state.error,
    getOrdersHistory: (state) => state.orders
  }
});

export default ordersHistorySlice;
export const { getOrdersHistory, getError, getOrdersLoading } =
  ordersHistorySlice.selectors;
