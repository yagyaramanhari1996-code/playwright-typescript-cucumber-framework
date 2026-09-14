import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  // ── Search ──────────────────────────────────────────────────────────────────
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsTitle: Locator;

  // ── Listing ─────────────────────────────────────────────────────────────────
  readonly allProductCards: Locator;
  readonly allProductsHeading: Locator;

  // ── Cart modal ─────────────────────────────────────────────────────────────
  readonly addedToCartModal: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLinkInModal: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsTitle = page.locator('.title.text-center');

    this.allProductCards = page.locator('.product-image-wrapper');
    this.allProductsHeading = page.locator('.title.text-center', { hasText: 'All Products' });

    this.addedToCartModal = page.locator('#cartModal');
    this.continueShoppingButton = page.locator('#cartModal button:has-text("Continue Shopping")');
    this.viewCartLinkInModal = page.locator('#cartModal a:has-text("View Cart")');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigate('/products');
  }

  async searchProduct(productName: string): Promise<void> {
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    await this.waitForNavigation();
  }

  /** Hover over the Nth product card (0-indexed) and click "Add to cart" */
  async addProductToCartByIndex(index: number): Promise<void> {
    const card = this.allProductCards.nth(index);
    await this.scrollTo(card);
    await this.hoverOver(card);
    await card.locator('.product-overlay a.add-to-cart').click();
    await this.assertVisible(this.addedToCartModal);
  }

  /** Find a product card by its visible name and add it to the cart */
  async addProductToCartByName(productName: string): Promise<void> {
    const card = this.allProductCards.filter({ hasText: productName }).first();
    await this.scrollTo(card);
    await this.hoverOver(card);
    await card.locator('.product-overlay a:has-text("Add to cart")').click();
    await this.assertVisible(this.addedToCartModal);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async goToCartFromModal(): Promise<void> {
    await this.click(this.viewCartLinkInModal);
    await this.waitForNavigation();
  }

  async getProductCount(): Promise<number> {
    return this.allProductCards.count();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return this.getText(this.allProductCards.nth(index).locator('p'));
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  async assertSearchedProductsVisible(): Promise<void> {
    await this.assertVisible(this.searchedProductsTitle);
    await this.assertExactText(this.searchedProductsTitle, 'Searched Products');
  }

  async assertAllProductsVisible(): Promise<void> {
    await this.assertVisible(this.allProductsHeading);
  }

  async assertAddedToCartModalVisible(): Promise<void> {
    await this.assertVisible(this.addedToCartModal);
  }

  async assertProductCountGreaterThan(min: number): Promise<void> {
    const count = await this.getProductCount();
    if (count <= min) {
      throw new Error(`Expected more than ${min} products, but found ${count}`);
    }
  }
}
