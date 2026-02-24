import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Blog verification', () => {
  test('should have a working home page with pre-rendered content', async ({
    page,
  }) => {
    await page.goto('http://localhost:4173/');
    await expect(page.locator('my-header header')).toBeVisible();
    await expect(page.locator('h1')).toContainText('I am Pedro Martin Valera');

    // Check for accessibility
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog index should show posts', async ({ page }) => {
    await page.goto('http://localhost:4173/blog/');
    await expect(page.locator('post-item')).toHaveCount(4);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('installfest page should have syntax highlighting and be accessible', async ({
    page,
  }) => {
    await page.goto('http://localhost:4173/installfest/');
    await expect(page.locator('pre.shiki').first()).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('mobile navigation toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:4173/');

    const header = page.locator('my-header header');
    await expect(header).not.toHaveClass(/has-nav/);

    await page.click('.navigation-toggle');
    await expect(header).toHaveClass(/has-nav/);
  });
});
