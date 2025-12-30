/* eslint-env cypress/globals */
// ***********************************************
// Custom commands and overrides
// ***********************************************

// Example: Custom command for login
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login')
//   cy.get('input[name="email"]').type(email)
//   cy.get('input[name="password"]').type(password)
//   cy.get('button[type="submit"]').click()
// })

// Suppress ResizeObserver errors
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
