import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api'; // <-- Добавили импорт orderBurgerApi

import type { RootState } from '../rootReducer';
import type { TOrder } from '@utils-types';

type TUserState = {
  orders: TOrder[];
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  orders: [],
  orderData: null,
  isLoading: false,
  error: null,
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Не удалось загрузить заказы');
    }
  }
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Не удалось оформить заказ');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getOrders.pending, (state) => {
        state.orders = [];
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.orders = [];
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? action.error.message ?? 'Ошибка загрузки';
      })

      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? action.error.message ?? 'Ошибка оформления';
      });
  },
});

export const { clearOrderData } = orderSlice.actions;
export const selectOrders = (state: RootState): TOrder[] => state.order.orders;
export const selectOrderIsLoading = (state: RootState): boolean => state.order.isLoading;
export const selectOrdersError = (state: RootState): string | null => state.order.error;
export const selectCurrentOrderData = (state: RootState): TOrder | null =>
  state.order.orderData;
export default orderSlice.reducer;
