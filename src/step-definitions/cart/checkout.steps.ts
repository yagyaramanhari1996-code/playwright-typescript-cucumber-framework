import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { checkoutData } from '../../utils/test-data';

When('I proceed to checkout', async function (this: CustomWorld) {
  const cartPage = this.get<CartPage>('cartPage');
  await cartPage.proceedToCheckout();
  this.set('checkoutPage', new CheckoutPage(this.page));
});

Then('I should see my delivery address and order review', async function (this: CustomWorld) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  await checkoutPage.assertAddressDetailsVisible();
  await checkoutPage.assertReviewOrderVisible();
});

When('I add an order comment {string}', async function (this: CustomWorld, comment: string) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  await checkoutPage.addOrderComment(comment);
});

When('I place the order', async function (this: CustomWorld) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  await checkoutPage.placeOrder();
});

When('I enter valid payment details', async function (this: CustomWorld) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  const { payment } = checkoutData();
  await checkoutPage.fillPaymentDetails(payment);
});

When('I confirm the payment', async function (this: CustomWorld) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  await checkoutPage.confirmPayment();
});

Then('my order should be placed successfully', async function (this: CustomWorld) {
  const checkoutPage = this.get<CheckoutPage>('checkoutPage');
  await checkoutPage.assertOrderPlacedSuccessfully();
});
