import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly addressDetailsSection: Locator;
  readonly reviewOrderSection: Locator;
  readonly orderCommentTextarea: Locator;
  readonly placeOrderButton: Locator;

  // Payment page
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.addressDetailsSection = page.locator('#address_delivery');
    this.reviewOrderSection = page.locator('#cart_info');
    this.orderCommentTextarea = page.locator('.form-control[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');

    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
    this.orderSuccessMessage = page.locator('[data-qa="order-placed"]');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async addOrderComment(comment: string): Promise<void> {
    await this.fill(this.orderCommentTextarea, comment);
  }

  async placeOrder(): Promise<void> {
    await this.click(this.placeOrderButton);
    await this.waitForNavigation();
  }

  async fillPaymentDetails(details: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.fill(this.nameOnCardInput, details.nameOnCard);
    await this.fill(this.cardNumberInput, details.cardNumber);
    await this.fill(this.cvcInput, details.cvc);
    await this.fill(this.expiryMonthInput, details.expiryMonth);
    await this.fill(this.expiryYearInput, details.expiryYear);
  }

  async confirmPayment(): Promise<void> {
    await this.click(this.payAndConfirmButton);
    await this.waitForNavigation();
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  async assertAddressDetailsVisible(): Promise<void> {
    await this.assertVisible(this.addressDetailsSection);
  }

  async assertReviewOrderVisible(): Promise<void> {
    await this.assertVisible(this.reviewOrderSection);
  }

  async assertOrderPlacedSuccessfully(): Promise<void> {
    await this.assertVisible(this.orderSuccessMessage);
    await this.assertExactText(
    this.orderSuccessMessage,
    'Your order has been placed successfully!'
  );
  }
}
