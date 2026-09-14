import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────────────────
  readonly logo: Locator;
  readonly signupLoginLink: Locator;
  readonly loggedInAsText: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly homeNavLink: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccessMessage: Locator;
  readonly scrollUpArrow: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.logo img');
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.locator('a[href="/view_cart"]');
    this.homeNavLink = page.locator('a[href="/"]').first();
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscriptionSuccessMessage = page.locator('#success-subscribe');
    this.scrollUpArrow = page.locator('#scrollUp');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async goToSignupLogin(): Promise<void> {
    await this.click(this.signupLoginLink);
  }

  async goToProducts(): Promise<void> {
    await this.click(this.productsLink);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  async logout(): Promise<void> {
  await this.click(this.logoutLink);
  await this.waitForNavigation();
}

  async deleteAccount(): Promise<void> {
    await this.click(this.deleteAccountLink);
  }

  async subscribeWithEmail(email: string): Promise<void> {
    await this.scrollTo(this.subscriptionEmailInput);
    await this.fill(this.subscriptionEmailInput, email);
    await this.click(this.subscribeButton);
  }

  // ── Assertions / queries ────────────────────────────────────────────────────

  async isLoggedInAs(username: string): Promise<boolean> {
    return this.isVisible(this.page.locator(`a:has-text("Logged in as ${username}")`));
  }

  async assertHomePageVisible(): Promise<void> {
    await this.assertVisible(this.logo);
  }

  async assertLoggedInAs(username: string): Promise<void> {
    await this.assertText(this.loggedInAsText, username);
  }

  async assertSubscriptionSuccess(): Promise<void> {
    await this.assertText(this.subscriptionSuccessMessage, 'You have been successfully subscribed!');
  }
}
