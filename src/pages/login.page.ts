import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // ── Login form ──────────────────────────────────────────────────────────────
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  // ── New user signup form ───────────────────────────────────────────────────
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  // ── Page headings ───────────────────────────────────────────────────────────
  readonly loginFormHeading: Locator;
  readonly signupFormHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Login
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('.login-form p[style*="color: red"]');

    // Signup
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupErrorMessage = page.locator('.signup-form p[style*="color: red"]');

    // Headings
    this.loginFormHeading = page.locator('.login-form h2');
    this.signupFormHeading = page.locator('.signup-form h2');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigate('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.loginEmailInput, email);
    await this.fill(this.loginPasswordInput, password);
    await this.click(this.loginButton);
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fill(this.signupNameInput, name);
    await this.fill(this.signupEmailInput, email);
    await this.click(this.signupButton);
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  async assertLoginPageVisible(): Promise<void> {
    await this.assertVisible(this.loginFormHeading);
    await this.assertExactText(this.loginFormHeading, 'Login to your account');
  }

  async assertLoginErrorVisible(message = 'Your email or password is incorrect!'): Promise<void> {
    await this.assertVisible(this.loginErrorMessage);
    await this.assertText(this.loginErrorMessage, message);
  }

  async assertSignupErrorVisible(message = 'Email Address already exist!'): Promise<void> {
    await this.assertVisible(this.signupErrorMessage);
    await this.assertText(this.signupErrorMessage, message);
  }
}
