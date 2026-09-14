import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { APIRequestContext, Browser, BrowserContext, Page } from 'playwright';

/**
 * CustomWorld extends Cucumber's World with Playwright browser primitives.
 * One browser + context + page is created per scenario (in hooks.ts).
 *
 * Access in step definitions via `this`:
 *   this.page    — Playwright Page
 *   this.context — Playwright BrowserContext
 *   this.browser — Playwright Browser
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  api!: APIRequestContext;
  testUser?: { name: string; email: string; password: string };

  /** Store arbitrary test-run state between steps */
  testData: Record<string, unknown> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Helper — persist a value across steps */
  set<T>(key: string, value: T): void {
    this.testData[key] = value;
  }

  /** Helper — retrieve a value set in a prior step */
  get<T>(key: string): T {
    return this.testData[key] as T;
  }
}

setWorldConstructor(CustomWorld);
