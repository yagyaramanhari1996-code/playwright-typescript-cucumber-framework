/**
 * playwright.config.ts
 *
 * Cucumber is the test runner here — NOT @playwright/test.
 * Shared browser defaults live in src/support/playwright-defaults.ts
 * (kept inside `src/` so they're under the TS `rootDir`) and are
 * re-exported here for tooling/imports that expect this file to exist.
 */
export { PLAYWRIGHT_DEFAULTS } from './src/support/playwright-defaults';

/*
 * Uncomment if you add @playwright/test test specs alongside cucumber:
 *
 * import { defineConfig, devices } from '@playwright/test';
 * export default defineConfig({
 *   testDir: './src/playwright-tests',
 *   timeout: 30_000,
 *   retries: 1,
 *   workers: process.env.CI ? 4 : 2,
 *   reporter: [['allure-playwright'], ['html', { open: 'never' }]],
 *   use: {
 *     baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
 *     trace: 'retain-on-failure',
 *     screenshot: 'only-on-failure',
 *     video: 'retain-on-failure',
 *   },
 *   projects: [
 *     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
 *     { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
 *   ],
 * });
 */
