const { test, expect } = require('@playwright/test');

function randomEmail() {
  return `test+${Date.now()}@example.com`;
}

test('anonymous add -> persist anon key', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/products');
  // ensure storage clean
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // click first Add to cart button
  const add = page.locator('text=Add to cart').first();
  await expect(add).toBeVisible();
  await add.click();

  // check anon key exists and has at least one item
  const keys = await page.evaluate(() => Object.keys(localStorage));
  const anonKey = keys.find(k => k === 'cart:v1:anon');
  expect(anonKey).toBeDefined();
  const data = JSON.parse(await page.evaluate(k => localStorage.getItem(k), anonKey));
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});

test('register/login merges anon into user cart and checkout clears it', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/products');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // add one item anon
  await page.locator('text=Add to cart').first().click();

  // go to register
  await page.goto('http://127.0.0.1:3000/login');
  await page.locator('text=Create account').click();
  const email = randomEmail();
  await page.fill('input[placeholder="email"]', email);
  await page.fill('input[placeholder="password"]', 'Password123!');
  await page.locator('text=Register').click();

  // switch to login and perform login
  await page.fill('input[placeholder="email"]', email);
  await page.fill('input[placeholder="password"]', 'Password123!');
  await page.locator('text=Login').click();

  // wait for Signed in as
  await expect(page.locator('text=Signed in as')).toBeVisible();

  // user cart key should exist and anon key should be removed locally
  const keys = await page.evaluate(() => Object.keys(localStorage));
  const userKey = keys.find(k => k.startsWith('cart:v1:user:'));
  expect(userKey).toBeDefined();
  expect(keys.find(k => k === 'cart:v1:anon')).toBeUndefined();

  // header cart count should be 1
  await expect(page.locator('text=Cart (1)')).toBeVisible();

  // verify server-side cart contains the merged item (retry a few times if backend takes a moment)
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeDefined();
  const getServerCart = async () => {
    const res = await page.request.get('http://127.0.0.1:4000/carts/me', { headers: { Authorization: `Bearer ${token}` } });
    expect(res.ok()).toBeTruthy();
    return await res.json();
  };

  const waitForServerCartCount = async (expected, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const d = await getServerCart();
      if (d.items && d.items.length === expected) return d;
      await page.waitForTimeout(200);
    }
    throw new Error('Timed out waiting for server cart to reach expected count');
  };

  await waitForServerCartCount(1);

  // visit cart page and proceed to checkout
  await page.goto('http://127.0.0.1:3000/cart');
  await expect(page.locator('text=Proceed to checkout')).toBeVisible();
  await page.locator('text=Proceed to checkout').click();

  // on checkout, pay
  await expect(page.locator('text=Pay')).toBeVisible();
  await page.locator('text=Pay').click();

  // after pay, the user's cart should be cleared locally and on server
  const post = JSON.parse(await page.evaluate(k => localStorage.getItem(k), userKey));
  expect(Array.isArray(post)).toBeTruthy();
  expect(post.length).toBe(0);

  const serverAfter = await getServerCart();
  expect(Array.isArray(serverAfter.items)).toBeTruthy();
  expect(serverAfter.items.length).toBe(0);
});