import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedData,
  getFeedOrders,
  getLoading
} from '../../services/slices/FeedDataSlice';

export const Feed: FC = () => {
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);

  useEffect(() => {
    dispatch(getFeedData()).then((result) => {});
  }, [dispatch]);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  <FeedUI
    orders={orders}
    handleGetFeeds={() => {
      dispatch(getFeedData());
    }}
  />;
};
