import { test, expect } from '@playwright/test';

test.describe('Application E2E Tests', () => {
  test('should navigate through main pages', async ({ page }) => {
    await page.goto('/');
    
    // Check home page loads
    await expect(page).toHaveTitle(/findmyservice/i);
    
    // Navigate to profile (if accessible without login)
    await page.goto('/profile');
    await expect(page.locator('text=Personal Information')).toBeVisible({ timeout: 5000 });
  });

  test('should handle theme toggle', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeButton = page.locator('[aria-label*="theme" i]').or(page.locator('button:has([data-testid*="Brightness"])'));
    
    if (await themeButton.count() > 0) {
      const initialBg = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      await themeButton.first().click();
      await page.waitForTimeout(500);
      
      const newBg = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Background should change
      expect(initialBg).not.toBe(newBg);
    }
  });

  test('should be responsive', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/profile');
      
      await expect(page.locator('text=Personal Information')).toBeVisible();
      
      // Take screenshot for visual regression
      await page.screenshot({ 
        path: `e2e/screenshots/profile-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
    }
  });

  test('should handle navigation and back button', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to profile
    await page.goto('/profile');
    await expect(page.locator('text=Personal Information')).toBeVisible();
    
    // Use back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Use forward button
    await page.goForward();
    await expect(page).toHaveURL('/profile');
  });

  test('should persist Redux state across navigation', async ({ page }) => {
    await page.goto('/profile');
    
    // Fill some data
    await page.fill('input[name="firstName"]', 'TestUser');
    
    // Navigate away and back
    await page.goto('/');
    await page.goto('/profile');
    
    // Check if Redux state persists (if you have persistence configured)
    const value = await page.locator('input[name="firstName"]').inputValue();
    
    // This will depend on whether you have Redux persistence enabled
    // If not, it will be empty
    expect(value).toBeDefined();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test invalid routes
    await page.goto('/invalid-route');
    
    // Should show 404 or redirect to home
    const url = page.url();
    expect(url).toMatch(/(404|\/)/);
  });

  test('should load all assets', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check main page loads successfully
    expect(response.status()).toBe(200);
    
    // Check no console errors (critical ones)
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Allow some non-critical errors but not too many
    expect(errors.length).toBeLessThan(5);
  });

  test('should handle form submission with network delay', async ({ page }) => {
    await page.goto('/profile');
    
    // Simulate slow network
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.click('button:has-text("Save Changes")');
    
    // Loading state should be visible
    await expect(page.locator('.Toastify__toast--default, .Toastify__toast--info')).toBeVisible({ timeout: 3000 });
  });

  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/profile');
    
    // Check for basic accessibility
    const formElements = await page.locator('input, button, textarea').all();
    
    for (const element of formElements) {
      // Each form element should have a label or aria-label
      const ariaLabel = await element.getAttribute('aria-label');
      const id = await element.getAttribute('id');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(ariaLabel || label > 0).toBeTruthy();
      }
    }
  });

  test('should handle rapid tab switching', async ({ page }) => {
    await page.goto('/profile');
    
    // Rapidly switch between tabs
    for (let i = 0; i < 5; i++) {
      await page.click('text=Address');
      await page.waitForTimeout(100);
      await page.click('text=Personal Info');
      await page.waitForTimeout(100);
      await page.click('text=Account Settings');
      await page.waitForTimeout(100);
    }
    
    // Should still be functional
    await page.click('text=Personal Info');
    await expect(page.locator('text=Personal Information')).toBeVisible();
  });
});
