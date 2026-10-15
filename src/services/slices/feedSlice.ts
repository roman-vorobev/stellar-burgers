import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@/utils/types';

export type TFeedCounts = {
  total: number;
  totalToday: number;
};

interface TFeedsState {
  orders: TOrder[];
  orderData: TOrder | null;
  counts: TFeedCounts;
  isLoading: boolean;
  error: string | null;
}

const counts: TFeedCounts = {
  total: 0,
  totalToday: 0,
};

const initialState: TFeedsState = {
  orders: [],
  orderData: null,
  counts: counts,
  isLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk('ordersFeeds', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'orderFeed',
  async (number: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(number);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить заказ');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.counts.total = action.payload.total;
      state.counts.totalToday = action.payload.totalToday;
      state.error = null;
    },
  },
  selectors: {
    selectFeed: (sliceState) => sliceState.orders,
    selectOrderData: (sliceState) => sliceState.orderData,
    selectFeedCounts: (sliceState) => sliceState.counts,
    selectFeedIsLoading: (sliceState) => sliceState.isLoading,
    selectFeedError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orders = [];
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.error = null;
        state.counts.total = action.payload.total;
        state.counts.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.orders = [];
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderData = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderData = null;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.orders.length) {
          state.orderData = action.payload.orders[0];
          state.error = null;
        } else {
          state.orderData = null;
          state.error = action.payload as unknown as string;
        }
      });
  },
});

export const { setFeed } = feedSlice.actions;
export const {
  selectFeed,
  selectOrderData,
  selectFeedCounts,
  selectFeedIsLoading,
  selectFeedError,
} = feedSlice.selectors;
export default feedSlice.reducer;
