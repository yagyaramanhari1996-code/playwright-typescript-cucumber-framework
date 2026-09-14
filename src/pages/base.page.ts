import { Page, Locator } from 'playwright';
import { expect } from '@playwright/test';
import { ENV } from '../utils/env';
import { logger } from '../utils/logger';

/**
 * BasePage contains all reusable Playwright interactions.
 * Every page object inherits from this class.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly timeout: number;

  constructor(page: Page) {
    this.page = page;
    this.timeout = ENV.DEFAULT_TIMEOUT;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigate(urlPath: string = ''): Promise<void> {
    const url = `${ENV.BASE_URL}${urlPath}`;
    logger.debug(`→ ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.timeout });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: this.timeout });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded', timeout: this.timeout });
  }

  // ── Element interactions ────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeout ?? this.timeout });
  }

  async click(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await locator.textContent()) ?? '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return locator.inputValue();
  }

  async isVisible(locator: Locator, timeout = 5_000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async scrollTo(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async hoverOver(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.hover();
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible({ timeout: this.timeout });
  }

  async assertHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden({ timeout: this.timeout });
  }

  async assertText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text, { timeout: this.timeout });
  }

  async assertExactText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toHaveText(text, { timeout: this.timeout });
  }

  async assertURL(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern, { timeout: this.timeout });
  }

  async assertTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title, { timeout: this.timeout });
  }

  async assertCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count, { timeout: this.timeout });
  }

  async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled({ timeout: this.timeout });
  }

  async assertAttributeContains(locator: Locator, attribute: string, value: string): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, new RegExp(value), { timeout: this.timeout });
  }
}
