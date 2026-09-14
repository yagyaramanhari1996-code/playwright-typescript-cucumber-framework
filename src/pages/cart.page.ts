import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly registerLoginLinkInModal: Locator;

  constructor(page: Page) {
    super(page);

    this.cartTable = page.locator('#cart_info_table');
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.registerLoginLinkInModal = page.locator('.modal-body a:has-text("Register / Login")');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigate('/view_cart');
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.proceedToCheckoutButton);
  }

  async removeProductByIndex(index: number): Promise<void> {
    const row = this.cartRows.nth(index);
    await row.locator('.cart_quantity_delete').click();
    await row.waitFor({ state: 'detached', timeout: this.timeout }).catch(() => undefined);
  }

  async getItemCount(): Promise<number> {
    return this.cartRows.count();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return this.getText(this.cartRows.nth(index).locator('.cart_description h4 a'));
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    return this.getText(this.cartRows.nth(index).locator('.cart_price p'));
  }

  async getProductQuantityByIndex(index: number): Promise<string> {
    return this.getText(this.cartRows.nth(index).locator('.cart_quantity button'));
  }

  async getProductTotalByIndex(index: number): Promise<string> {
    return this.getText(this.cartRows.nth(index).locator('.cart_total .cart_total_price'));
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  async assertCartVisible(): Promise<void> {
    await this.assertVisible(this.cartTable);
  }

  async assertCartIsEmpty(): Promise<void> {
    await this.assertVisible(this.emptyCartMessage);
  }

  async assertItemCount(expected: number): Promise<void> {
    await this.assertCount(this.cartRows, expected);
  }

  async assertProductInCart(productName: string): Promise<void> {
    await this.assertVisible(this.page.locator(`.cart_description h4 a:has-text("${productName}")`));
  }
}
