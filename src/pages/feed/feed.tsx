import { getFeeds, selectFeed, selectFeedIsLoading } from '@/services/slices/feedSlice';
import { useDispatch, useSelector, type AppDispatch } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const orders: TOrder[] = useSelector(selectFeed);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectFeedIsLoading);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
