/// <reference types="cypress" />

describe('Оформление заказа пользователем', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/auth/user', { fixture: 'user-response.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order-response.json' });
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });

    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');

    cy.visit('/');
  });

  it('Пользователь собирает бургер и оформляет заказ', () => {
    // Добавляем булку
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .should('exist')
      .contains('Добавить')
      .click();

    // Добавляем начинку
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]')
      .should('exist')
      .contains('Добавить')
      .click();

    // Проверяем содержимое конструктора
    cy.get('[data-cy=burger_constructor]')
      .should('contain.text', 'Краторная булка N-200i (верх)')
      .and('contain.text', 'Краторная булка N-200i (низ)')
      .and('contain.text', 'Биокотлета из марсианской Магнолии');

    // Отправляем заказ
    cy.get('[data-cy=order_container]')
      .contains('Оформить заказ')
      .click();

    // Проверка открытия модалки с номером заказа
    cy.get('[data-cy=modal]')
      .should('exist')
      .and('contain.text', '912');

    // Закрываем модалку
    cy.get('[data-cy=modal_close]')
      .click();

    cy.get('[data-cy=modal]')
      .should('not.exist');

    // Проверяем, что конструктор сбросился
    cy.get('[data-cy=burger_constructor]')
      .should('contain.text', 'Выберите начинку')
      .invoke('text')
      .then((text) => {
        const bunPrompts = (text.match(/Выберите булки/g) || []).length;
        expect(bunPrompts).to.equal(2);
      });
  });

  it('Нельзя оформить заказ без ингредиентов', () => {
    // Убедимся, что ничего не выбрано
    cy.get('[data-cy=burger_constructor]')
      .should('contain.text', 'Выберите начинку')
      .invoke('text')
      .then((text) => {
        const bunPrompts = (text.match(/Выберите булки/g) || []).length;
        expect(bunPrompts).to.equal(2);
      });

    // Пытаемся оформить заказ
    cy.get('[data-cy=order_container]')
      .contains('Оформить заказ')
      .click();

    // Модалка не должна появиться
    cy.get('[data-cy=modal]')
      .should('not.exist');
  });

  it('Нельзя оформить заказ без булки', () => {
    // Добавляем только начинку
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=burger_constructor]')
      .should('contain.text', 'Биокотлета из марсианской Магнолии');

    // Кнопка "Оформить заказ" должна быть неактивна
    cy.get('[data-cy=order_container]')
      .contains('Оформить заказ')
      .click();

    cy.get('[data-cy=modal]').should('not.exist');


  });

  it('После оформления заказ сбрасывается полностью', () => {
    // Добавим ингредиенты
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]')
      .contains('Добавить')
      .click();

    // Оформим заказ
    cy.get('[data-cy=order_container]')
      .contains('Оформить заказ')
      .click();

    // Закрываем модалку
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal_close]').click();

    // Проверка сброса
    cy.get('[data-cy=burger_constructor]')
      .find('[data-cy^=constructor_item_]')
      .should('have.length', 0);

  });

  it('Пользователь может оформить заказ повторно', () => {
    // Первый заказ
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]').contains('Добавить').click();
    cy.get('[data-cy=order_container]').contains('Оформить заказ').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal_close]').click();

    // Второй заказ
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]').contains('Добавить').click();
    cy.get('[data-cy=order_container]').contains('Оформить заказ').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal_close]').click();
  });

});
