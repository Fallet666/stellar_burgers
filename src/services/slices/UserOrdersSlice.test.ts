import slice from './UserOrdersSlice';
import { ordersHistory } from './UserOrdersSlice';

const reducer = slice.reducer;

describe('Проверка UserOrdersSlice', () => {
    const initialState = {
        orders: [],
        error: null,
        loading: false
    };

    it('Проверка начального состояния', () => {
        expect(reducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('Установка loading=true при ordersHistory.pending', () => {
        const action = { type: ordersHistory.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
    });

    it('Установка данных и loading=false при ordersHistory.fulfilled', () => {
        const mockPayload = [
            {
                _id: 'order1',
                status: 'done',
                name: 'Бургер №1',
                createdAt: '2025-05-27T12:00:00Z',
                updatedAt: '2025-05-27T13:00:00Z',
                number: 1,
                ingredients: ['ing1', 'ing2', 'ing3']
            },
            {
                _id: 'order2',
                status: 'done',
                name: 'Бургер №2',
                createdAt: '2025-05-27T14:00:00Z',
                updatedAt: '2025-05-27T14:30:00Z',
                number: 123246,
                ingredients: ['ing4', 'ing5']
            }
        ]

        const action = { type: ordersHistory.fulfilled.type, payload: mockPayload };
        const state = reducer({ ...initialState, loading: true }, action);

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockPayload);
    });

    it('Установка ошибки и loading=false при ordersHistory.rejected', () => {
        const action = { type: ordersHistory.rejected.type, error: { message: 'error' } };
        const state = reducer({ ...initialState, loading: true }, action);
        
        expect(state.loading).toBe(false);
        expect(state.error).toBe('error');
    });
});