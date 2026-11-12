import { describe, test, expect } from '@jest/globals';
import { fetchIngredients } from '../ingredientsSlice';
import ingredientsReducer, { initialState } from '../ingredientsSlice';
import type { TIngredient } from '@/utils/types';

describe('Тестирование редьюсера ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d6964ac3d7d001be207ad',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    },
    {
      _id: '6acd6b8163765e407c0bd9ed',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://norma.ffapi.ru/images/meat-03.png',
      image_mobile: 'https://norma.ffapi.ru/images/meat-03-mobile.png',
      image_large: 'https://norma.ffapi.ru/images/meat-03-large.png',
    },
  ];

  test('Возвращает начальное состояние при вызове с undefined и неизвестным экшеном (unknown)', () => {
    const action = { type: 'unknown' };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('Проверка выполнения async action fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка выполнения async action fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('Проверка выполнения async action fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage },
    };
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
