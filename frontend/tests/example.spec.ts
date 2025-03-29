import { test, expect } from '@playwright/test';

test('should display the login page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('h1')).toHaveText('Login');
});

test('should allow user to log in', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'montassar@example.com');
  await page.fill('input[name="password"]', 'montassar');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/');
});
