import { describe, test, expect } from '@jest/globals';
import burgerConstructorReducer, {
  initialState,
  addConstructorItems,
  removeConstructorItems,
  removeAllConstructorItems,
  moveUpConstructorItems,
  moveDownConstructorItems,
} from '../constructorSlice';
import type { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Тестирование редьюсера constructorSlice', () => {
  const mockBun: TIngredient = {
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
  };

  const mockMainIngredient: TIngredient = {
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
  };

  test('возвращает начальное состояние при вызове с undefined и неизвестным экшеном (unknown)', () => {
    const action = { type: 'unknown' };
    const state = burgerConstructorReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  test('Проверка добавления булки (bun) в конструктор через метод addConstructorItems', () => {
    const action = addConstructorItems(mockBun);
    const state = burgerConstructorReducer(initialState, action);

    expect(state.bun).toEqual(
      expect.objectContaining({
        _id: mockBun._id,
        id: expect.any(String),
      })
    );
    expect(state.constructorItems).toEqual([]);
  });

  test('Проверка добавления ингредиента в список constructorItems через метод addConstructorItems', () => {
    const action = addConstructorItems(mockMainIngredient);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.constructorItems).toHaveLength(1);
    expect(state.constructorItems[0]).toEqual(
      expect.objectContaining({
        _id: mockMainIngredient._id,
        id: expect.any(String),
      })
    );
  });

  test('Проверка удаления ингредиента по id через метод removeConstructorItems', () => {
    const ingredientWithId: TConstructorIngredient = {
      ...mockMainIngredient,
      id: '212',
    };
    const prepState = {
      ...initialState,
      constructorItems: [ingredientWithId],
    };
    const action = removeConstructorItems('212');
    const state = burgerConstructorReducer(prepState, action);
    expect(state.constructorItems).toHaveLength(0);
  });

  test('Проверка перемещения ингредиента вверх через мктод moveUpConstructorItems', () => {
    const ingredient1: TConstructorIngredient = {
      ...mockMainIngredient,
      id: 'id-1',
      name: 'Ингредиент 1',
    };
    const ingredient2: TConstructorIngredient = {
      ...mockMainIngredient,
      id: 'id-2',
      name: 'Ингредиент 2',
    };
    const prepState = {
      ...initialState,
      constructorItems: [ingredient1, ingredient2],
    };
    const action = moveUpConstructorItems('id-2');
    const state = burgerConstructorReducer(prepState, action);
    expect(state.constructorItems[0].id).toBe('id-2');
    expect(state.constructorItems[1].id).toBe('id-1');
  });

  test('Проверка перемещения ингредиента вниз через метод moveDownConstructorItems', () => {
    const ingredient1: TConstructorIngredient = {
      ...mockMainIngredient,
      id: 'id-1',
      name: 'Ингредиент 1',
    };
    const ingredient2: TConstructorIngredient = {
      ...mockMainIngredient,
      id: 'id-2',
      name: 'Ингредиент 2',
    };
    const prepState = {
      ...initialState,
      constructorItems: [ingredient1, ingredient2],
    };
    const action = moveDownConstructorItems('id-1');
    const state = burgerConstructorReducer(prepState, action);
    expect(state.constructorItems[0].id).toBe('id-2');
    expect(state.constructorItems[1].id).toBe('id-1');
  });

  test('Проверка очистки конструктора через метод removeAllConstructorItems', () => {
    const prepState = {
      bun: { ...mockBun, id: 'bun-id' },
      constructorItems: [{ ...mockMainIngredient, id: 'ingredient-id' }],
    };
    const action = removeAllConstructorItems();
    const state = burgerConstructorReducer(prepState, action);
    expect(state.bun).toBeNull();
    expect(state.constructorItems).toEqual([]);
  });
});
