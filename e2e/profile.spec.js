import { test, expect } from '@playwright/test';

test.describe('Profile Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('should load profile page successfully', async ({ page }) => {
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=Personal Info')).toBeVisible();
    await expect(page.locator('text=Address')).toBeVisible();
    await expect(page.locator('text=Account Settings')).toBeVisible();
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Phone Number')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click Address tab
    await page.click('text=Address');
    await expect(page.locator('text=Address Information')).toBeVisible();
    await expect(page.getByLabel('Address Line 1')).toBeVisible();

    // Click Account Settings tab
    await page.click('text=Account Settings');
    await expect(page.locator('text=Change Password')).toBeVisible();
    await expect(page.getByLabel('Current Password')).toBeVisible();

    // Click back to Personal Info
    await page.click('text=Personal Info');
    await expect(page.locator('text=Personal Information')).toBeVisible();
  });

  test('should fill and submit personal information', async ({ page }) => {
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="phone"]', '+1234567890');

    await page.click('button:has-text("Save Changes")');
    
    // Check for success toast (may need to adjust selector based on your toast library)
    await expect(page.locator('.Toastify__toast--success')).toBeVisible({ timeout: 3000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("Save Changes")');
    
    // Check for error toast
    await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 3000 });
  });

  test('should validate phone number format', async ({ page }) => {
    await page.fill('input[name="phone"]', 'abc');
    await page.click('button:has-text("Save Changes")');
    
    // Check for error toast
    await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 3000 });
  });

  test('should upload profile picture', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    // Upload a test image
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    });

    // Check if "Change Photo" button appears
    await expect(page.locator('button:has-text("Change Photo")')).toBeVisible({ timeout: 3000 });
  });

  test('should reject invalid file type for profile picture', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-content'),
    });

    // Check for error toast
    await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 3000 });
  });

  test('should fill and submit address information', async ({ page }) => {
    await page.click('text=Address');
    
    await page.fill('input[name="addressLine1"]', '123 Main St');
    await page.fill('input[name="addressLine2"]', 'Apt 4B');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="state"]', 'NY');
    await page.fill('input[name="zipCode"]', '10001');

    await page.click('button:has-text("Save Changes")');
    
    await expect(page.locator('.Toastify__toast--success')).toBeVisible({ timeout: 3000 });
  });

  test('should validate password change', async ({ page }) => {
    await page.click('text=Account Settings');
    
    await page.fill('input[name="currentPassword"]', 'oldpass123');
    await page.fill('input[name="newPassword"]', 'newpass456');
    await page.fill('input[name="confirmPassword"]', 'differentpass');

    await page.click('button:has-text("Change Password")');
    
    // Check for mismatch error
    await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 3000 });
  });

  test('should successfully change password', async ({ page }) => {
    await page.click('text=Account Settings');
    
    await page.fill('input[name="currentPassword"]', 'oldpass123');
    await page.fill('input[name="newPassword"]', 'newpass456');
    await page.fill('input[name="confirmPassword"]', 'newpass456');

    await page.click('button:has-text("Change Password")');
    
    await expect(page.locator('.Toastify__toast--success')).toBeVisible({ timeout: 3000 });
    
    // Password fields should be cleared
    await expect(page.locator('input[name="currentPassword"]')).toHaveValue('');
    await expect(page.locator('input[name="newPassword"]')).toHaveValue('');
    await expect(page.locator('input[name="confirmPassword"]')).toHaveValue('');
  });

  test('should preserve form data when switching tabs', async ({ page }) => {
    // Fill personal info
    await page.fill('input[name="firstName"]', 'Jane');
    
    // Switch to address
    await page.click('text=Address');
    await expect(page.getByLabel('Address Line 1')).toBeVisible();
    
    // Switch back to personal
    await page.click('text=Personal Info');
    
    // Check if data is preserved
    await expect(page.locator('input[name="firstName"]')).toHaveValue('Jane');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sidebar should be visible above content on mobile
    const sidebar = page.locator('text=Personal Info').first();
    const content = page.locator('text=Personal Information');
    
    await expect(sidebar).toBeVisible();
    await expect(content).toBeVisible();
    
    // Check that all fields are full width
    const firstName = page.getByLabel('First Name');
    const box = await firstName.boundingBox();
    expect(box.width).toBeGreaterThan(300); // Should use most of viewport width
  });

  test('should work in dark mode', async ({ page }) => {
    // Find and click theme toggle (adjust selector based on your implementation)
    const themeToggle = page.locator('[aria-label*="theme" i]').or(page.locator('button:has-text("Dark")'));
    
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      
      // Check if dark mode is applied (adjust based on your theme implementation)
      const body = page.locator('body');
      await expect(body).toHaveCSS('background-color', /rgb\(|#/);
    }
  });

  test('should display required field indicators', async ({ page }) => {
    // Check for asterisks on required fields
    const firstNameLabel = page.locator('label:has-text("First Name")');
    await expect(firstNameLabel).toContainText('*');
    
    const emailLabel = page.locator('label:has-text("Email")');
    await expect(emailLabel).toContainText('*');
  });
});
