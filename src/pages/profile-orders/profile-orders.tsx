import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersHistory, getOrdersLoading, ordersHistory } from '../../services/slices/UserOrdersHistory';
import { Preloader } from '@ui';


export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getOrdersHistory);
  const loading = useSelector(getOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ordersHistory());
  }, []);

  if (loading) {
    return <Preloader />;
  }
  
  return <ProfileOrdersUI orders={orders} />;
};
