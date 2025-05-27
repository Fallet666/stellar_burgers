import { rootReducer } from './store';

describe('Проверка инициализации rootReducer', () => {
    it('Проверка инициализации rootReducer', () => {
        const state = rootReducer(undefined, { type: '@@INIT' });
        expect(state).toHaveProperty('userState');
        expect(state).toHaveProperty('feed');
        expect(state).toHaveProperty('burgerConstructor');
        expect(state).toHaveProperty('orderHistory');
    });
});