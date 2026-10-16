import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '../rootReducer';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  constructorItems: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  constructorItems: [],
};

const constructorSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addConstructorItems: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.constructorItems.push(item);
        }
      },
      prepare: (item: TIngredient): { payload: TConstructorIngredient } => ({
        payload: {
          ...item,
          _id: item._id,
          id: nanoid(),
        },
      }),
    },
    removeConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = state.constructorItems.filter(
        (x) => x.id !== action.payload
      );
    },
    removeAllConstructorItems: (state) => {
      state.constructorItems = [];
      state.bun = null;
    },
    moveUpConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = moveItem(state.constructorItems, action.payload, 'up');
    },
    moveDownConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = moveItem(state.constructorItems, action.payload, 'down');
    },
  },
});

function moveItem(
  arr: TConstructorIngredient[],
  id: string,
  mode: 'up' | 'down'
): TConstructorIngredient[] {
  const item = arr.find((x) => x.id === id);
  if (!item) {
    return arr;
  }

  const index = arr.indexOf(item);
  if (index === -1) {
    return [...arr];
  }
  const result = [...arr];

  if (mode === 'up') {
    if (index > 0) {
      result[index] = result[index - 1];
      result[index - 1] = item;
    }
  } else {
    if (index < arr.length - 1) {
      result[index] = result[index + 1];
      result[index + 1] = item;
    }
  }
  return result;
}

export const {
  addConstructorItems,
  removeConstructorItems,
  removeAllConstructorItems,
  moveUpConstructorItems,
  moveDownConstructorItems,
} = constructorSlice.actions;
export const selectItems = (state: RootState): TConstructorIngredient[] =>
  state.constructors.constructorItems;

export const selectBun = (state: RootState): TIngredient | null =>
  state.constructors.bun;

export default constructorSlice.reducer;
