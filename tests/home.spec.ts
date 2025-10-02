import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/xCloud/);
});

test('homepage displays main content', async ({ page }) => {
  await page.goto('/');
  const mainContent = page.locator('main');
  await expect(mainContent).toBeVisible();
});
