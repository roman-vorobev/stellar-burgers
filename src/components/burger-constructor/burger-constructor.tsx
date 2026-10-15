import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useDispatch, useSelector } from '@/services/store';
import { useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';
import { selectUser } from '@/services/slices/authSlice';
import { selectBun, selectItems } from '@/services/slices/constructorSlice';

import { removeAllConstructorItems } from '@/services/slices/constructorSlice';
import {
  orderBurger,
  selectOrderIsLoading,
  selectOrders,
  clearOrderData,
} from '@/services/slices/orderSlice';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingredients = useSelector(selectItems);
  const bun = useSelector(selectBun);
  const user = useSelector(selectUser);

  const orderRequest = useSelector(selectOrderIsLoading);
  const allOrders = useSelector(selectOrders);

  const orderModalData = useMemo(() => {
    return allOrders.length > 0 ? allOrders[allOrders.length - 1] : null;
  }, [allOrders]);

  const constructorItems = useMemo(
    () => ({
      bun,
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

    dispatch(orderBurger(orderData));
  };

  // TODO: Диспатч экшена создания заказа (например, postOrder)

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
