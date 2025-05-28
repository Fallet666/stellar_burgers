/// <reference types="cypress" />

// Селекторы для конструктора
const SELECTORS = {
  BUN_INGREDIENTS: '[data-cy=bun_ingredients]',
  MAIN_INGREDIENTS: '[data-cy=main_ingredients]',
  BUN_TOP: '[data-cy=bun_top_constructor]',
  BUN_BOTTOM: '[data-cy=bun_bottom_constructor]',
  MAIN_CONSTRUCTOR: '[data-cy=main_constructor]',
  INGREDIENT: id => `[data-cy=ingredient_${id}]`,
};

describe('Конструктор бургера: добавление ингредиентов', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Установка булки в верхнюю и нижнюю часть конструктора', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const bunName = 'Краторная булка N-200i';

    // Проверяем, что список булок отрисовался
    cy.get(SELECTORS.BUN_INGREDIENTS)
      .should('be.visible')
      .and('contain.text', bunName);

    // Убедиться, что булки еще нет в конструкторе
    cy.get(SELECTORS.BUN_TOP).should('not.exist');
    cy.get(SELECTORS.BUN_BOTTOM).should('not.exist');

    // Добавляем булку
    cy.get(SELECTORS.INGREDIENT(bunId))
      .should('be.visible')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем появление в верхней и нижней части конструктора
    cy.get(SELECTORS.BUN_TOP)
      .should('exist')
      .and('contain.text', bunName);

    cy.get(SELECTORS.BUN_BOTTOM)
      .should('exist')
      .and('contain.text', bunName);
  });

  it('Добавление ингредиента из раздела "Начинки"', () => {
    const ingredientId = '643d69a5c3f7b9001cfa0941';
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    // Скроллим в нужную зону, чтобы список отрисовался
    cy.get(SELECTORS.MAIN_INGREDIENTS)
      .scrollIntoView()
      .should('exist')
      .and('contain.text', ingredientName);

    // Убедиться, что ингредиент еще не добавлен
    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('not.contain.text', ingredientName);

    // Добавляем ингредиент
    cy.get(SELECTORS.INGREDIENT(ingredientId))
      .scrollIntoView()
      .should('exist')
      .contains('Добавить')
      .click();

    // Проверяем, что ингредиент появился в конструкторе
    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('exist')
      .and('contain.text', ingredientName);
  });

  it('Можно добавить несколько одинаковых начинок', () => {
    const id = '643d69a5c3f7b9001cfa0941';
    const name = 'Биокотлета из марсианской Магнолии';

    // Убедиться, что такого компонента еще нет
    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('not.contain.text', name);

    // Добавляем два одинаковых ингредиента
    for (let i = 0; i < 2; i++) {
      cy.get(SELECTORS.INGREDIENT(id))
        .scrollIntoView()
        .should('exist')
        .contains('Добавить')
        .click();
    }

    // Проверяем, что оба добавились
    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .find('li')
      .filter(`:contains("${name}")`)
      .should('have.length', 2);
  });
});
