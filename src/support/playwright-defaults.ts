/**
 * Shared Playwright browser/context defaults.
 * Lives inside src/ so it can be imported by hooks.ts under the
 * project's `rootDir`. Re-exported by the root playwright.config.ts
 * for tooling that expects that file to exist.
 */
export const PLAYWRIGHT_DEFAULTS = {
  viewport: { width: 1280, height: 720 },
  ignoreHTTPSErrors: true,
  acceptDownloads: true,
  launchOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  },
  tracing: {
    screenshots: true,
    snapshots: true,
    sources: true,
  },
} as const;
