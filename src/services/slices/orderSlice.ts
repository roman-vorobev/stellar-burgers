import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api'; // <-- Добавили импорт orderBurgerApi
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';
import type { RootState } from '../rootReducer';

interface TUserState {
  orders: TOrder[];
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить заказы');
    }
  }
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось оформить заказ');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orders = [];
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
          (action.payload as string) || action.error.message || 'Ошибка загрузки';
      })

      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Ошибка оформления';
      });
  },
});

export const { clearOrderData } = orderSlice.actions;
export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrderIsLoading = (state: RootState) => state.order.isLoading;
export const selectOrdersError = (state: RootState) => state.order.error;
export const selectCurrentOrderData = (state: RootState) => state.order.orderData;
export default orderSlice.reducer;
