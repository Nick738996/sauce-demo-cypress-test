Cypress.Commands.add('login', user => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(Cypress.env(user));
  cy.get('[data-test="password"]').type(Cypress.env('password'));
  cy.get('form').submit();
  return this;
});

Cypress.Commands.add('validateUrl', url => {
  return cy.url().should('include', url);
});

Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.contains('Logout').click();
});
