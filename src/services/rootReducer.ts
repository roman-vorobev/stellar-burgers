//TODO: Собрать здесь редьюсеры слайсов
//: Record<string, never>
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import dataReducer from './slices/dataSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  constructors: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
