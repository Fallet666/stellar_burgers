import slice from './BurgerConstructorSlice';
import {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder
} from './BurgerConstructorSlice';

const reducer = slice.reducer;

const testBurgerIngredients = {
    bun: {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
    },
    main1: {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
    },
    main2: {
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        __v: 0
    },
    sauce: {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        __v: 0,
    },
};

describe('Проверка BurgerConstructorSlice', () => {
    it('Проверка начального состояния', () => {
        const state = reducer(undefined, { type: '' });
        const expectedState = {
            loading: false,
            error: null,
            constructorItems: {
                bun: null,
                ingredients: []
            },
            orderRequest: false,
            orderModalData: null
        };

        expect(state).toEqual(expectedState);
    });

    it('Обработка экшена добавления ингредиента', () => {
        let state = reducer(undefined, addIngredient(testBurgerIngredients.bun));

        expect(state.constructorItems.bun).toMatchObject(testBurgerIngredients.bun);
        expect(state.constructorItems.ingredients).toHaveLength(0);

        state = reducer(state, addIngredient(testBurgerIngredients.main1));
        expect(state.constructorItems.ingredients[0]).toMatchObject(testBurgerIngredients.main1);
        expect(state.constructorItems.ingredients).toHaveLength(1);

        state = reducer(state, addIngredient(testBurgerIngredients.main2));
        expect(state.constructorItems.ingredients[1]).toMatchObject(testBurgerIngredients.main2);
        expect(state.constructorItems.ingredients).toHaveLength(2);

        state = reducer(state, addIngredient(testBurgerIngredients.sauce));
        expect(state.constructorItems.ingredients[2]).toMatchObject(testBurgerIngredients.sauce);
        expect(state.constructorItems.ingredients).toHaveLength(3);
    });

    it('Обработка экшена удаления ингредиента', () => {
        let state = reducer(undefined, { type: '' });

        state = reducer(state, addIngredient(testBurgerIngredients.bun));
        state = reducer(state, addIngredient(testBurgerIngredients.main1));
        state = reducer(state, addIngredient(testBurgerIngredients.main2));
        state = reducer(state, addIngredient(testBurgerIngredients.sauce));

        const ingredientToRemove = state.constructorItems.ingredients.find(
            item => item._id === testBurgerIngredients.main1._id
        );

        expect(state.constructorItems.ingredients).toContainEqual(ingredientToRemove);
        expect(state.constructorItems.ingredients).toHaveLength(3);

        expect(ingredientToRemove).toBeDefined();
        
        state = reducer(state, removeIngredient(ingredientToRemove!));
        expect(state.constructorItems.ingredients).not.toContainEqual(ingredientToRemove);
        expect(state.constructorItems.ingredients).toHaveLength(2);
    });

    it('Обработка экшена изменения порядка ингредиентов в начинке', () => {
        let state = reducer(undefined, { type: '' });

        state = reducer(state, addIngredient(testBurgerIngredients.main1));
        state = reducer(state, addIngredient(testBurgerIngredients.main2));

        state = reducer(state, moveDownIngredient(0));

        expect(state.constructorItems.ingredients[0]).toMatchObject(testBurgerIngredients.main2);
        expect(state.constructorItems.ingredients[1]).toMatchObject(testBurgerIngredients.main1);

        state = reducer(state, moveUpIngredient(1));

        expect(state.constructorItems.ingredients[0]).toMatchObject(testBurgerIngredients.main1);
        expect(state.constructorItems.ingredients[1]).toMatchObject(testBurgerIngredients.main2);
    });

    it('Обработка экшена очистки конструктора', () => {
        const initialState = {
            loading: false,
            error: null,
            constructorItems: {
                bun: null,
                ingredients: []
            },
            orderRequest: false,
            orderModalData: null
        };

        let state = reducer(undefined, { type: '' });

        state = reducer(state, addIngredient(testBurgerIngredients.bun));
        state = reducer(state, addIngredient(testBurgerIngredients.main1));
        state = reducer(state, addIngredient(testBurgerIngredients.main2));
        state = reducer(state, addIngredient(testBurgerIngredients.sauce));

        state = reducer(state, clearOrder());

        expect(state).toEqual(initialState);
    });
});