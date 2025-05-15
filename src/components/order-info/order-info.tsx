import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useSelector } from '../../services/store';
import { getIngredientsSelector } from '../../services/slices/IngredientsSlice';
import { useParams } from 'react-router-dom';

export const selectOrderById = (number: number) => (state: RootState) => {
  if (state.feed.orders.length || state.orderHistory.orders.length) {
    return (
      state.feed.orders.find((order) => order.number === number) ||
      state.orderHistory.orders.find((order) => order.number === number)
    );
  }
  if (state.feed.modalOrder) {
    return state.feed.modalOrder.number === number
      ? state.feed.modalOrder
      : null;
  }
  return null;
};

export const OrderInfo: FC = () => {

  const { number } = useParams();
  
  const orderData = useSelector(selectOrderById(Number(number)));

  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
