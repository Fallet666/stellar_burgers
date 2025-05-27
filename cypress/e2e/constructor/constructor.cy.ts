/// <reference types="cypress" />

describe('Конструктор бургера: добавление ингредиентов', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Установка булки в верхнюю и нижнюю часть конструктора', () => {
    // Проверяем, что список булок отрисовался
    cy.get('[data-cy=bun_ingredients]')
      .should('be.visible')
      .and('contain.text', 'Краторная булка N-200i');

    // Добавляем булку
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .should('be.visible')
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем появление в верхней и нижней части конструктора
    cy.get('[data-cy=bun_top_constructor]')
      .should('exist')
      .and('contain.text', 'Краторная булка N-200i');

    cy.get('[data-cy=bun_bottom_constructor]')
      .should('exist')
      .and('contain.text', 'Краторная булка N-200i');
  });

  it('Добавление ингредиента из раздела "Начинки"', () => {
    // Скроллим в нужную зону, чтобы убрать обрезку
    cy.get('[data-cy=main_ingredients]')
      .scrollIntoView()
      .should('exist') // без visible
      .and('contain.text', 'Биокотлета из марсианской Магнолии');

    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]')
      .scrollIntoView()
      .should('exist');

    // Жмём по "Добавить" без within
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa0941]')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=main_constructor]')
      .should('exist')
      .and('contain.text', 'Биокотлета из марсианской Магнолии');
  });

  it('Можно добавить несколько одинаковых начинок', () => {
    const id = '643d69a5c3f7b9001cfa0941';

    for (let i = 0; i < 2; i++) {
      cy.get(`[data-cy=ingredient_${id}]`)
        .scrollIntoView()
        .should('exist')
        .contains('Добавить')
        .click();
    }

    // Проверка по тексту, если нет data-cy
    cy.get('[data-cy=main_constructor]')
      .find('li') // или другой селектор, который реально там рендерится
      .filter(':contains("Биокотлета из марсианской Магнолии")')
      .should('have.length', 2);
  });
});
