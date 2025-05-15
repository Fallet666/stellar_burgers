import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: null | string;
  loading: boolean;
  modalOrder: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  loading: false,
  modalOrder: null
};

export const getFeedData = createAsyncThunk('feed/data', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrder',
  async (number: number, { rejectWithValue }) => {
    try {
      const respons = await getOrderByNumberApi(number);
      return respons;
    } catch {
      return rejectWithValue('Error feed data');
    }
  }
);

export const feedDataSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(getFeedData.rejected, (state, action) => {
        state.error = action.error.message || 'error feed';
        state.loading = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.modalOrder = action.payload.orders[0];
        state.loading = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error feed';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalEmountOrders: (state) => state.total,
    getTotalEmountToday: (state) => state.totalToday,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    selectModalOrder: (state) => state.modalOrder
  }
});

export default feedDataSlice;
export const {
  getFeedOrders,
  getTotalEmountOrders,
  getTotalEmountToday,
  getLoading,
  getError
} = feedDataSlice.selectors;
