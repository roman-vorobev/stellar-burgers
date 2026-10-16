import { selectUser } from '@/services/slices/authSlice';
import {
  removeAllConstructorItems,
  selectBun,
  selectItems,
} from '@/services/slices/constructorSlice';
import {
  orderBurger,
  selectOrderIsLoading,
  clearOrderData,
  selectCurrentOrderData,
} from '@/services/slices/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingredients = useSelector(selectItems);
  const bun = useSelector(selectBun);
  const user = useSelector(selectUser);

  const orderRequest = useSelector(selectOrderIsLoading);

  const orderModalData = useSelector(selectCurrentOrderData);

  const constructorItems = useMemo(
    () => ({
      bun: bun ? { ...bun, id: bun._id } : null,
      ingredients,
    }),
    [bun, ingredients]
  );

  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;

    if (!user) {
      void navigate('/login');
      return;
    }

    const orderData = [bun._id, ...ingredients.map((item) => item._id), bun._id];
    dispatch(orderBurger(orderData))
      .then((action) => {
        if (orderBurger.fulfilled.match(action)) {
          dispatch(removeAllConstructorItems());
        }
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };
  const closeOrderModal = (): void => {
    dispatch(removeAllConstructorItems());
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum: number, v: TConstructorIngredient) => sum + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
