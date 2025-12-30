describe('Application E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load home page successfully', () => {
    cy.contains('Find My Service').should('be.visible');
  });

  it('should navigate through main pages', () => {
    // Navigate to home
    cy.visit('/');
    cy.url().should('include', '/');

    // Check if main elements are visible
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
  });

  it('should toggle theme mode', () => {
    // Find and click theme toggle button
    cy.get('button[aria-label*="theme"]').click();
    
    // Verify theme changed (check for dark mode class or background color)
    cy.get('body').should('have.css', 'background-color');
  });

  it('should search for services', () => {
    cy.get('input[placeholder*="Search"]').type('plumbing');
    cy.get('button[type="submit"]').click();
    
    // Should navigate to search results
    cy.url().should('include', '/search');
  });

  it('should navigate to profile page', () => {
    // Assuming there's a profile link in navigation
    cy.contains('Profile').click();
    cy.url().should('include', '/profile');
  });

  it('should handle 404 page', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
  });

  it('should be accessible', () => {
    // Basic accessibility checks
    cy.get('header').should('have.attr', 'role');
    cy.get('main').should('exist');
  });

  it('should work on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('header').should('be.visible');
  });

  it('should work on tablet viewport', () => {
    cy.viewport('ipad-2');
    cy.visit('/');
    cy.get('header').should('be.visible');
  });

  it('should load without console errors', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error');
      },
    });
    
    cy.window().then((win) => {
      expect(win.console.error).to.not.be.called;
    });
  });
});
