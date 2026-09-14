import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { HomePage } from '../../pages/home.page';
import { ProductsPage } from '../../pages/products.page';
import { CartPage } from '../../pages/cart.page';
import { LoginPage } from '../../pages/login.page';

Given('I am on the home page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.open();
  await homePage.assertHomePageVisible();
});

When('I navigate to the products page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);

  console.log('Products count:', await this.page.locator('a[href="/products"]').count());
  console.log('Before URL:', this.page.url());

  await homePage.goToProducts();

  console.log('After URL:', this.page.url());

  this.set('productsPage', new ProductsPage(this.page));
});

When('I navigate to the login page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.goToSignupLogin();
  this.set('loginPage', new LoginPage(this.page));
});

When('I view my cart from the confirmation modal', async function (this: CustomWorld) {
  const productsPage = this.get<ProductsPage>('productsPage');
  await productsPage.goToCartFromModal();
  this.set('cartPage', new CartPage(this.page));
});
