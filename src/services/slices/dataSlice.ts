import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { TIngredient } from '@/utils/types';

type DataState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: DataState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchingIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchingIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Не удалось загрузить ингредиенты');
  }
});

const dataSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearDataError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchingIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchingIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchingIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload!;
      });
  },
});

export const { clearDataError } = dataSlice.actions;
export default dataSlice.reducer;

// export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
// export const selectIngredientsLoading = (state: RootState) =>
//   state.ingredients.isLoading;
// export const selectIngredientsError = (state: RootState) => state.ingredients.error;
