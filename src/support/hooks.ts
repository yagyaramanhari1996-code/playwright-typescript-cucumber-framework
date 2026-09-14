import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium, firefox, webkit, request } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { CustomWorld } from './world';
import { ENV } from '../utils/env';
import { logger } from '../utils/logger';
import { PLAYWRIGHT_DEFAULTS } from './playwright-defaults';

// ── Global timeout for every step ─────────────────────────────────────────────
setDefaultTimeout(ENV.DEFAULT_TIMEOUT);

// ── Directories created once before any scenario runs ─────────────────────────
BeforeAll(async function () {
  const dirs = [
    'reports',
    'reports/screenshots',
    'reports/videos',
    'reports/traces',
    'allure-results',
  ];
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }
  logger.info(`Framework starting — env: ${ENV.TEST_ENV} | browser: ${ENV.BROWSER} | headless: ${ENV.HEADLESS}`);
});

// ── Per-scenario browser setup ─────────────────────────────────────────────────
Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  logger.info(`▶ [${pickle.tags.map(t => t.name).join(', ')}] ${pickle.name}`);

  const launchers = { chromium, firefox, webkit };
  const launcher = launchers[ENV.BROWSER];
  if (!launcher) throw new Error(`Unknown browser: "${ENV.BROWSER}". Use chromium, firefox, or webkit.`);

  this.browser = await launcher.launch({
    headless: ENV.HEADLESS,
    slowMo: ENV.SLOW_MO,
    args: [...PLAYWRIGHT_DEFAULTS.launchOptions.args],
  });

  this.context = await this.browser.newContext({
    viewport: PLAYWRIGHT_DEFAULTS.viewport,
    ignoreHTTPSErrors: PLAYWRIGHT_DEFAULTS.ignoreHTTPSErrors,
    acceptDownloads: PLAYWRIGHT_DEFAULTS.acceptDownloads,
    ...(ENV.RECORD_VIDEO
      ? { recordVideo: { dir: 'reports/videos', size: PLAYWRIGHT_DEFAULTS.viewport } }
      : {}),
  });

  if (ENV.TRACE_ON_FAILURE) {
    await this.context.tracing.start(PLAYWRIGHT_DEFAULTS.tracing);
  }

  this.page = await this.context.newPage();

  // Auth/checkout scenarios need a real account. Create a unique test user
  // through Automation Exercise's documented API so the suite never depends
  // on hard-coded credentials.
  const tags = pickle.tags.map(t => t.name);
  if (tags.includes('@auth') || tags.includes('@checkout')) {
    this.api = await request.newContext({ baseURL: ENV.BASE_URL });
    const unique = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const user = {
      name: 'Playwright Automation User',
      email: `pw.cucumber.${unique}@example.com`,
      password: 'Test@1234',
    };

    const response = await this.api.post('/api/createAccount', {
      form: {
        name: user.name, email: user.email, password: user.password, title: 'Mr',
        birth_date: '10', birth_month: '5', birth_year: '1995',
        firstname: 'Playwright', lastname: 'Automation', company: 'QA Demo',
        address1: '1 Test Street', address2: 'Automation Park', country: 'India',
        zipcode: '600001', state: 'Tamil Nadu', city: 'Chennai', mobile_number: '9000000000'
      }
    });
    const body = await response.json();

if (response.status() !== 200 || body.responseCode !== 201) {
  throw new Error(
    `Test account creation failed: HTTP ${response.status()} ${JSON.stringify(body)}`
  );
}
    this.testUser = user;
  }
});

// ── Per-scenario teardown — screenshot + trace on failure ──────────────────────
After(async function (this: CustomWorld, { pickle, result }: ITestCaseHookParameter) {
  const failed = result?.status === Status.FAILED;

  if (failed) {
    logger.error(`✗ FAILED: ${pickle.name}`);

    // Screenshot — attached to Allure / Cucumber HTML report
    if (ENV.SCREENSHOT_ON_FAILURE && this.page) {
      try {
        const screenshot = await this.page.screenshot({ fullPage: true });
        await this.attach(screenshot, 'image/png');
        logger.debug('Screenshot attached');
      } catch (err) {
        logger.warn(`Screenshot capture failed: ${err}`);
      }
    }

    // Playwright Trace — attached as a downloadable ZIP
    if (ENV.TRACE_ON_FAILURE && this.context) {
      try {
        const traceFile = path.join('reports/traces', `${pickle.id}.zip`);
        await this.context.tracing.stop({ path: traceFile });
        const traceData = fs.readFileSync(traceFile);
        await this.attach(traceData, 'application/zip');
        logger.debug(`Trace saved: ${traceFile}`);
      } catch (err) {
        logger.warn(`Trace capture failed: ${err}`);
      }
    }
  } else {
    logger.info(`✓ PASSED: ${pickle.name}`);
    if (ENV.TRACE_ON_FAILURE && this.context) {
      // Stop tracing but discard — test passed
      await this.context.tracing.stop();
    }
  }

  // Always close page → context → browser in the right order
  await this.page?.close();
  await this.context?.close();
  if (this.api && this.testUser) {
    try {
      await this.api.delete('/api/deleteAccount', {
        form: { email: this.testUser.email, password: this.testUser.password }
      });
    } catch (err) {
      logger.warn(`Test account cleanup failed: ${err}`);
    }
    await this.api.dispose();
  }

  await this.browser?.close();
});

AfterAll(async function () {
  logger.info('Framework teardown complete.');
});
