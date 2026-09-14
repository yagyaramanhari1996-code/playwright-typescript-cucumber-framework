import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type BrowserName = 'chromium' | 'firefox' | 'webkit';

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() !== 'false' && value !== '0';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  const parsed = parseInt(value ?? '', 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseBrowser(value: string | undefined): BrowserName {
  const browsers: BrowserName[] = ['chromium', 'firefox', 'webkit'];
  const lower = (value ?? '').toLowerCase() as BrowserName;
  return browsers.includes(lower) ? lower : 'chromium';
}

export const ENV = {
  BASE_URL:             process.env.BASE_URL ?? 'https://automationexercise.com',
  BROWSER:              parseBrowser(process.env.BROWSER),
  HEADLESS:             parseBool(process.env.HEADLESS, true),
  SLOW_MO:              parseNumber(process.env.SLOW_MO, 0),
  DEFAULT_TIMEOUT:      parseNumber(process.env.TIMEOUT, 30_000),
  RECORD_VIDEO:         parseBool(process.env.RECORD_VIDEO, false),
  SCREENSHOT_ON_FAILURE: parseBool(process.env.SCREENSHOT_ON_FAILURE, true),
  TRACE_ON_FAILURE:     parseBool(process.env.TRACE_ON_FAILURE, false),
  TEST_ENV:             process.env.TEST_ENV ?? 'dev',
} as const;

export type Environment = typeof ENV;
