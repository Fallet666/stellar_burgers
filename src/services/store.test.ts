import { rootReducer } from './store';
import userReducer, { initialState as userInitialState } from './slices/user';
import feedReducer, { initialState as feedInitialState } from './slices/feed';
import burgerConstructorReducer, { initialState as burgerConstructorInitialState } from './slices/burgerConstructor';
import orderHistoryReducer, { initialState as orderHistoryInitialState } from './slices/orderHistory';

describe('Проверка инициализации rootReducer', () => {
    it('должен корректно инициализировать начальный state', () => {
        const state = rootReducer(undefined, { type: '@@INIT' });
        expect(state).toEqual({
            userState: userInitialState,
            feed: feedInitialState,
            burgerConstructor: burgerConstructorInitialState,
            orderHistory: orderHistoryInitialState,
        });
    });
});
