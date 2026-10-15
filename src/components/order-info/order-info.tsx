import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@/services/store';
import {
  getOrderByNumber,
  selectOrderData,
  selectFeedIsLoading,
  selectFeed,
} from '@/services/slices/feedSlice';
import { selectOrders } from '@/services/slices/orderSlice';
import { selectIngredients } from '@/services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderData);
  const isLoading = useSelector(selectFeedIsLoading);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const allFeedOrders = useSelector(selectFeed);
  const allProfileOrders = useSelector(selectOrders);

  useEffect(() => {
    if (number) {
      void dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    const currentOrder =
      orderData ||
      allFeedOrders.find((item) => item.number === Number(number)) ||
      allProfileOrders.find((item) => item.number === Number(number));

    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, allFeedOrders, allProfileOrders, ingredients, number]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
