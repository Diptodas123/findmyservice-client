describe('Profile Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should load profile page successfully', () => {
    cy.contains('Personal Information').should('be.visible');
    cy.contains('Personal Info').should('be.visible');
    cy.contains('Address').should('be.visible');
    cy.contains('Account Settings').should('be.visible');
  });

  it('should display all form fields', () => {
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
  });

  it('should switch between tabs', () => {
    // Click Address tab
    cy.contains('Address').click();
    cy.contains('Address Information').should('be.visible');
    cy.get('input[name="addressLine1"]').should('be.visible');

    // Click Account Settings tab
    cy.contains('Account Settings').click();
    cy.contains('Change Password').should('be.visible');
    cy.get('input[name="currentPassword"]').should('be.visible');

    // Click back to Personal Info
    cy.contains('Personal Info').click();
    cy.contains('Personal Information').should('be.visible');
  });

  it('should fill and submit personal information', () => {
    cy.get('input[name="name"]').clear().type('John Doe');
    cy.get('input[name="email"]').clear().type('john.doe@example.com');
    cy.get('input[name="phone"]').clear().type('+1234567890');

    cy.contains('button', 'Save Changes').click();
    
    // Check for success toast
    cy.get('.Toastify__toast--success', { timeout: 3000 }).should('be.visible');
  });

  it('should validate email format', () => {
    cy.get('input[name="email"]').clear().type('invalid-email');
    cy.contains('button', 'Save Changes').click();
    
    // Check for error toast
    cy.get('.Toastify__toast--error', { timeout: 3000 }).should('be.visible');
  });

  it('should validate phone number format', () => {
    cy.get('input[name="phone"]').clear().type('abc');
    cy.contains('button', 'Save Changes').click();
    
    // Check for error toast
    cy.get('.Toastify__toast--error', { timeout: 3000 }).should('be.visible');
  });

  it('should upload profile picture', () => {
    // Create a test image file
    cy.fixture('test-image.png', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'test-image.png',
        mimeType: 'image/png',
        encoding: 'base64'
      });
    });

    // Check if "Change Photo" button appears
    cy.contains('button', 'Change Photo', { timeout: 3000 }).should('be.visible');
  });

  it('should fill and submit address information', () => {
    cy.contains('Address').click();
    
    cy.get('input[name="addressLine1"]').clear().type('123 Main St');
    cy.get('input[name="addressLine2"]').clear().type('Apt 4B');
    cy.get('input[name="city"]').clear().type('New York');
    cy.get('input[name="state"]').clear().type('NY');
    cy.get('input[name="zipCode"]').clear().type('10001');

    cy.contains('button', 'Save Changes').click();
    
    // Check for success toast
    cy.get('.Toastify__toast--success', { timeout: 3000 }).should('be.visible');
  });

  it('should change password successfully', () => {
    cy.contains('Account Settings').click();
    
    cy.get('input[name="currentPassword"]').type('oldPassword123');
    cy.get('input[name="newPassword"]').type('newPassword456');
    cy.get('input[name="confirmPassword"]').type('newPassword456');

    cy.contains('button', 'Change Password').click();
    
    // Check for success toast
    cy.get('.Toastify__toast--success', { timeout: 3000 }).should('be.visible');
  });

  it('should validate password match', () => {
    cy.contains('Account Settings').click();
    
    cy.get('input[name="currentPassword"]').type('oldPassword123');
    cy.get('input[name="newPassword"]').type('newPassword456');
    cy.get('input[name="confirmPassword"]').type('differentPassword789');

    cy.contains('button', 'Change Password').click();
    
    // Check for error toast
    cy.get('.Toastify__toast--error', { timeout: 3000 }).should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    
    cy.contains('Personal Info').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
  });

  it('should be responsive on tablet', () => {
    cy.viewport('ipad-2');
    
    cy.contains('Personal Information').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
  });
});
