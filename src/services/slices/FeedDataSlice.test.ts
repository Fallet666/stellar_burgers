import slice from './FeedDataSlice';
import { getFeedData, getOrderByNumber } from './FeedDataSlice';

const reducer = slice.reducer;

describe('Проверка FeedDataSlice', () => {
    const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        error: null,
        loading: false,
        modalOrder: null
    };

    it('Проверка начального состояния', () => {
        expect(reducer(undefined, { type: '' })).toEqual(initialState);
    });

    //getFeedData
    it('Установка loading=true при getFeedData.pending', () => {
        const action = { type: getFeedData.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
    });

    it('Установка данных и loading=false при getFeedData.fulfilled', () => {
        const mockPayload = {
            orders: [
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
            ],
            total: 2,
            totalToday: 2
        };

        const action = { type: getFeedData.fulfilled.type, payload: mockPayload };
        const state = reducer({ ...initialState, loading: true }, action);

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockPayload.orders);
        expect(state.total).toBe(mockPayload.total);
        expect(state.totalToday).toBe(mockPayload.totalToday);
    });

    it('Установка ошибки и loading=false при getFeedData.rejected', () => {
        const action = { type: getFeedData.rejected.type, error: { message: 'error' } };
        const state = reducer({ ...initialState, loading: true }, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('error');
    });

    //getOrderByNumber
    it('Установка loading=true при getOrderByNumber.pending', () => {
        const action = { type: getOrderByNumber.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
    });

    it('Установка данных и loading=false при getOrderByNumber.fulfilled', () => {
        const mockPayload = {
            orders: [
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
        }

        const action = { type: getOrderByNumber.fulfilled.type, payload: mockPayload };
        const state = reducer({ ...initialState, loading: true }, action);

        expect(state.loading).toBe(false);
        expect(state.modalOrder).toEqual(mockPayload.orders[0]);
    });

    it('Установка ошибки и loading=false при getOrderByNumber.rejected', () => {
        const action = { type: getOrderByNumber.rejected.type, error: { message: 'error' } };
        const state = reducer({ ...initialState, loading: true }, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('error');
    });
});