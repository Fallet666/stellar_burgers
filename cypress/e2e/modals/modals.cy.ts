/// <reference types="cypress" />

// Селекторы для модалок
const MODAL = '[data-cy=modal]';
const MODAL_CLOSE = '[data-cy=modal_close]';
const MODAL_OVERLAY = '[data-cy=modal_overlay]';
const getIngredient = id => `[data-cy=ingredient_${id}]`;

describe('Модальные окна: просмотр и закрытие', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  afterEach(() => {
    // Очистка после каждого теста
    cy.clearCookies();
    cy.window().then(win => win.localStorage.clear());
  });

  it('Появляется модалка с деталями ингредиента при клике', () => {
    const id = '643d69a5c3f7b9001cfa093c';
    const name = 'Краторная булка N-200i';

    // Проверить, что модалка изначально отсутствует
    cy.get(MODAL).should('not.exist');

    // Открыть модалку
    cy.get(getIngredient(id))
      .scrollIntoView()
      .should('exist')
      .click();

    // Проверить содержимое модалки
    cy.get(MODAL)
      .should('exist')
      .within(() => {
        cy.contains(name);
        cy.contains('Калории');
      });
  });

  it('Модалка закрывается при нажатии на кнопку "×"', () => {
    const id = '643d69a5c3f7b9001cfa093c';

    // Проверить отсутствие до открытия
    cy.get(MODAL).should('not.exist');

    // Открыть модалку
    cy.get(getIngredient(id)).scrollIntoView().click();
    cy.get(MODAL).should('exist');

    // Закрыть кнопкой
    cy.get(MODAL_CLOSE)
      .should('exist')
      .click();

    // Убедиться, что модалка закрылась
    cy.get(MODAL).should('not.exist');
  });

  it('Модалка закрывается при клике вне её области (оверлей)', () => {
    const id = '643d69a5c3f7b9001cfa093c';

    // Проверить отсутствие модалки
    cy.get(MODAL).should('not.exist');

    // Открыть модалку
    cy.get(getIngredient(id)).scrollIntoView().click();
    cy.get(MODAL).should('exist');

    // Закрыть кликом по оверлею
    cy.get(MODAL_OVERLAY)
      .should('exist')
      .click({ force: true });

    // Проверить закрытие
    cy.get(MODAL).should('not.exist');
  });
});
