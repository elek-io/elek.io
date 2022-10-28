/// <reference types="cypress" />

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/').get('h1').contains('Welcome to Next.js!');
  });
});
