import { FeedInfoUI } from '@ui';
import { useSelector } from '@/services/store'; // используйте ваш типизированный useSelector
import {
  selectFeed,
  selectFeedCounts,
  selectFeedIsLoading,
  selectFeedError,
} from '@/services/slices/feedSlice';
import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(selectFeed);
  const counts = useSelector(selectFeedCounts);
  const isLoading = useSelector(selectFeedIsLoading);
  const error = useSelector(selectFeedError);

  const feed = {
    orders,
    total: counts.total,
    totalToday: counts.totalToday,
    isLoading,
    error,
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
