import { getOrders, selectOrders } from '@/services/slices/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';

import type { TOrder } from '@utils-types';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectOrders);

  return <ProfileOrdersUI orders={orders} />;
};
