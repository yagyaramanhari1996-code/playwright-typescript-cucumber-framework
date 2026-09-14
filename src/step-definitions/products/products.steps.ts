import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { ProductsPage } from '../../pages/products.page';

When('I search for the product {string}', async function (this: CustomWorld, term: string) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.searchProduct(term);
});

Then('I should see a list of all products', async function (this: CustomWorld) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.assertAllProductsVisible();
  await productsPage.assertProductCountGreaterThan(0);
});

Then('I should see {string} results', async function (this: CustomWorld, _heading: string) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.assertSearchedProductsVisible();
});

Then('the search results should contain at least {int} product', async function (this: CustomWorld, min: number) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.assertProductCountGreaterThan(min - 1);
});

When('I add the product at position {int} to the cart', async function (this: CustomWorld, position: number) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.addProductToCartByIndex(position - 1); // Gherkin is 1-indexed, Locator is 0-indexed
});

Then('I should see the {string} confirmation modal', async function (this: CustomWorld, _label: string) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.assertAddedToCartModalVisible();
});

When('I continue shopping', async function (this: CustomWorld) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.continueShopping();
});
