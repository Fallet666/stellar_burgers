/// <reference types="cypress" />

// Селекторы для оформления заказа
const SELECTORS = {
  USER_API: '/api/auth/user',
  ORDERS_API: '/api/orders',
  INGREDIENTS_API: '/api/ingredients',
  INGREDIENT: id => `[data-cy=ingredient_${id}]`,
  BURGER_CONSTRUCTOR: '[data-cy=burger_constructor]',
  ORDER_CONTAINER: '[data-cy=order_container]',
  MODAL: '[data-cy=modal]',
  MODAL_CLOSE: '[data-cy=modal_close]',
  CONSTRUCTOR_ITEM: '[data-cy^=constructor_item_]',
};

describe('Оформление заказа пользователем', () => {
  beforeEach(() => {
    cy.intercept('GET', SELECTORS.USER_API, { fixture: 'user-response.json' });
    cy.intercept('POST', SELECTORS.ORDERS_API, { fixture: 'order-response.json' });
    cy.intercept('GET', SELECTORS.INGREDIENTS_API, { fixture: 'ingredients.json' });

    // Моки авторизации
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');

    cy.visit('/');
  });

  afterEach(() => {
    // Очистка после каждого теста
    cy.clearCookies();
    cy.window().then(win => win.localStorage.clear());
  });

  it('Пользователь собирает бургер и оформляет заказ', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const bunName = 'Краторная булка N-200i';
    const fillingId = '643d69a5c3f7b9001cfa0941';
    const fillingName = 'Биокотлета из марсианской Магнолии';

    // Проверить, что конструктор изначально пуст
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('not.contain.text', bunName)
      .and('not.contain.text', fillingName);

    // Добавляем булку и начинку
    cy.get(SELECTORS.INGREDIENT(bunId))
      .should('exist')
      .contains('Добавить')
      .click();
    cy.get(SELECTORS.INGREDIENT(fillingId))
      .should('exist')
      .contains('Добавить')
      .click();

    // Проверяем содержимое конструктора
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('contain.text', `${bunName} (верх)`)
      .and('contain.text', `${bunName} (низ)`)
      .and('contain.text', fillingName);

    // Оформляем заказ
    cy.get(SELECTORS.ORDER_CONTAINER)
      .contains('Оформить заказ')
      .click();

    // Проверка модалки с номером заказа
    cy.get(SELECTORS.MODAL)
      .should('exist')
      .and('contain.text', '912');

    // Закрываем модалку
    cy.get(SELECTORS.MODAL_CLOSE)
      .click();
    cy.get(SELECTORS.MODAL)
      .should('not.exist');

    // Проверяем сброс конструктора
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('contain.text', 'Выберите начинку')
      .invoke('text')
      .then(text => {
        const bunPrompts = (text.match(/Выберите булки/g) || []).length;
        expect(bunPrompts).to.equal(2);
      });
  });

  it('Нельзя оформить заказ без ингредиентов', () => {
    // Проверить конструктор пуст
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('contain.text', 'Выберите начинку')
      .invoke('text')
      .then(text => {
        const bunPrompts = (text.match(/Выберите булки/g) || []).length;
        expect(bunPrompts).to.equal(2);
      });

    // Пытаемся оформить заказ
    cy.get(SELECTORS.ORDER_CONTAINER)
      .contains('Оформить заказ')
      .click();

    // Модалка не должна появиться
    cy.get(SELECTORS.MODAL)
      .should('not.exist');
  });

  it('Нельзя оформить заказ без булки', () => {
    const fillingId = '643d69a5c3f7b9001cfa0941';
    const fillingName = 'Биокотлета из марсианской Магнолии';

    // Убедиться, что булки нет
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('not.contain.text', fillingName);

    // Добавляем начинку
    cy.get(SELECTORS.INGREDIENT(fillingId))
      .contains('Добавить')
      .click();
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('contain.text', fillingName);

    // Пытаемся оформить заказ
    cy.get(SELECTORS.ORDER_CONTAINER)
      .contains('Оформить заказ')
      .click();
    cy.get(SELECTORS.MODAL)
      .should('not.exist');
  });

  it('После оформления заказ сбрасывается полностью', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const fillingId = '643d69a5c3f7b9001cfa0941';

    // Добавляем ингредиенты
    cy.get(SELECTORS.INGREDIENT(bunId)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(fillingId)).contains('Добавить').click();

    // Оформляем заказ
    cy.get(SELECTORS.ORDER_CONTAINER).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();

    // Проверяем сброс конструктора
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .find(SELECTORS.CONSTRUCTOR_ITEM)
      .should('have.length', 0);
  });

  it('Пользователь может оформить заказ повторно', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const fillingId = '643d69a5c3f7b9001cfa0941';

    // Первый заказ
    cy.get(SELECTORS.INGREDIENT(bunId)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(fillingId)).contains('Добавить').click();
    cy.get(SELECTORS.ORDER_CONTAINER).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();

    // Проверяем сброс перед вторым заказом
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .find(SELECTORS.CONSTRUCTOR_ITEM)
      .should('have.length', 0);

    // Второй заказ
    cy.get(SELECTORS.INGREDIENT(bunId)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(fillingId)).contains('Добавить').click();
    cy.get(SELECTORS.ORDER_CONTAINER).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();
  });
});
