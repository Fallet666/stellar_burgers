import { rootReducer } from './store';
// Импортируем slice-объекты (по умолчанию) и берём их .reducer для вычисления initialState
import userSlice from './slices/UserSlice';
import feedSlice from './slices/FeedDataSlice';
import ingredientsSlice from './slices/IngredientsSlice';
import burgerConstructorSlice from './slices/BurgerConstructorSlice';
import orderHistorySlice from './slices/UserOrdersSlice';

describe('Проверка инициализации rootReducer', () => {
    it('должен корректно инициализировать начальный state', () => {
        const expectedState = {
            userState: userSlice.reducer(undefined, { type: '@@INIT' }),
            feed: feedSlice.reducer(undefined, { type: '@@INIT' }),
            ingredients: ingredientsSlice.reducer(undefined, { type: '@@INIT' }),
            burgerConstructor: burgerConstructorSlice.reducer(undefined, { type: '@@INIT' }),
            orderHistory: orderHistorySlice.reducer(undefined, { type: '@@INIT' }),
        };

        const state = rootReducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(expectedState);
    });
});
