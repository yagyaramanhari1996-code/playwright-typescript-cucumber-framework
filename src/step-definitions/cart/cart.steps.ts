import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { CartPage } from '../../pages/cart.page';

Then('my cart should contain {int} item', async function (this: CustomWorld, count: number) {
  const cartPage = this.get<CartPage>('cartPage');
  await cartPage.assertCartVisible();
  await cartPage.assertItemCount(count);
});

Then('my cart should contain {int} items', async function (this: CustomWorld, count: number) {
  const cartPage = this.get<CartPage>('cartPage');
  await cartPage.assertCartVisible();
  await cartPage.assertItemCount(count);
});

When('I remove the product at position {int} from the cart', async function (this: CustomWorld, position: number) {
  const cartPage = this.get<CartPage>('cartPage');
  await cartPage.removeProductByIndex(position - 1);
});

Then('my cart should be empty', async function (this: CustomWorld) {
  const cartPage = this.get<CartPage>('cartPage');
  await cartPage.assertCartIsEmpty();
});
