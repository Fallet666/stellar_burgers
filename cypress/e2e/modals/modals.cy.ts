/// <reference types="cypress" />

describe('Модальные окна: просмотр и закрытие', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Появляется модалка с деталями ингредиента при клике', () => {
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .scrollIntoView()
      .should('exist')
      .click();

    cy.get('[data-cy=modal]')
      .should('exist')
      .within(() => {
        cy.contains('Краторная булка N-200i');
        cy.contains('Калории');
      });
  });

  it('Модалка закрывается при нажатии на кнопку "×"', () => {
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .scrollIntoView()
      .click();

    cy.get('[data-cy=modal]')
      .should('exist');

    cy.get('[data-cy=modal_close]')
      .should('exist')
      .click();

    cy.get('[data-cy=modal]')
      .should('not.exist');
  });

  it('Модалка закрывается при клике вне её области (оверлей)', () => {
    cy.get('[data-cy=ingredient_643d69a5c3f7b9001cfa093c]')
      .scrollIntoView()
      .click();

    cy.get('[data-cy=modal]')
      .should('exist');

    cy.get('[data-cy=modal_overlay]')
      .should('exist')
      .click({ force: true });

    cy.get('[data-cy=modal]')
      .should('not.exist');
  });
});
