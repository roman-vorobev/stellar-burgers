import { test, expect } from '@playwright/test';

test.describe('adding ingredients to constructor works correctly', function () {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    await page.goto('http://localhost:4000');
  });

  test('Add ingredient (bun and main)', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button').click();
    await expect(page.getByText('Выберите булки').first()).toBeHidden();
    await expect(bunCard.locator('.counter')).toHaveText('2');
    const mainCard = page.locator('li').filter({ hasText: 'Биокотлета' });
    await mainCard.getByRole('button').click();
    await expect(page.getByText('Выберите начинку')).toBeHidden();
    await expect(mainCard.locator('.counter')).toHaveText('1');
  });

  test('Ingredients modal window work', async ({ page }) => {
    await page.getByText('Флюоресцентная булка R2-D3').click();
    const modal = page.getByText('Детали ингредиента');
    await expect(modal).toBeVisible();
    await expect(
      page.locator('#modals').getByText('Флюоресцентная булка R2-D3', { exact: true })
    ).toBeVisible();
    await page.getByLabel('Закрыть').click();
    await expect(modal).toBeHidden();
  });

  test('Closing via overlay', async ({ page }) => {
    await page.getByText('Флюоресцентная булка R2-D3').click();
    const modal = page.getByText('Детали ингредиента');
    await expect(modal).toBeVisible();
    await page.locator('[class*="overlay"]').click({
      position: { x: 1, y: 1 },
      force: true,
    });
    await expect(modal).toBeHidden();
  });

  test('Create order', async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });
    await page.routeFromHAR('tests/hars/orders.har', {
      url: '**/api/orders',
      update: false,
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('http://localhost:4000');

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button')
      .click();
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета' })
      .getByRole('button')
      .click();
    await page
      .locator('li')
      .filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
      .getByRole('button')
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByText('Ваш заказ начали готовить');
    await expect(modal).toBeVisible();

    await expect(page.getByText('121')).toBeVisible();

    const constructorSection = page
      .locator('section')
      .filter({ has: page.getByRole('button', { name: 'Оформить заказ' }) });

    await expect(constructorSection.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructorSection.getByText('Выберите начинку')).toBeVisible();
    await expect(constructorSection.getByText('Биокотлета')).toBeHidden();
    await expect(
      constructorSection.getByText('Филе Люминесцентного тетраодонтимформа')
    ).toBeHidden();

    await page.getByLabel('Закрыть').click();
    await expect(modal).toBeHidden();
  });
});
