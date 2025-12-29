/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
};
