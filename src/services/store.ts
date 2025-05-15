import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userStateSlice from './slices/UserInfoSlice';
import ingredientsSlice from './slices/IngredientsSlice';
import feedDataSlice from './slices/FeedDataSlice';
import burgerConstructorSlice from './slices/BurgerConstructorSlice';
import ordersHistorySlice from './slices/UserOrdersHistory';

const rootReducer = combineReducers({
  [userStateSlice.name]: userStateSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [feedDataSlice.name]: feedDataSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [ordersHistorySlice.name]: ordersHistorySlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
