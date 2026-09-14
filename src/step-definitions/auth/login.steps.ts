import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';

/**
 * Note: In Cucumber.js, a step definition's Gherkin KEYWORD in the .feature
 * file (Given/When/And) does NOT need to match the keyword used to register
 * it — Cucumber matches purely on step TEXT. Registering the same text under
 * both `Given` and `When` creates two separate definitions for one pattern,
 * which Cucumber reports as "ambiguous step definition" the moment any
 * scenario hits that line. Register once; it works under any keyword.
 */
async function performLogin(world: CustomWorld, email: string, password: string): Promise<void> {
  let loginPage = world.get<LoginPage>('loginPage');
  if (!loginPage) {
    loginPage = new LoginPage(world.page);
    await loginPage.open();
    world.set('loginPage', loginPage);
  }
  await loginPage.login(email, password);
  world.set('homePage', new HomePage(world.page));
}

When('I login with configured valid credentials', async function (this: CustomWorld) {
  if (!this.testUser) throw new Error('No test user was created for this scenario.');
  await performLogin(this, this.testUser.email, this.testUser.password);
});

When('I login with email {string} and password {string}', async function (this: CustomWorld, email: string, password: string) {
  await performLogin(this, email, password);
});

Then('I should be logged in as {string}', async function (this: CustomWorld, username: string) {
  const homePage = this.get<HomePage>('homePage') ?? new HomePage(this.page);
  await homePage.assertLoggedInAs(username);
});

Then('I should see a login error message', async function (this: CustomWorld) {
  const loginPage = this.get<LoginPage>('loginPage');
  await loginPage.assertLoginErrorVisible();
});

When('I logout from the application', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage') ?? new HomePage(this.page);
  await homePage.logout();
  this.set('loginPage', new LoginPage(this.page));
});

Then('I should see the login page', async function (this: CustomWorld) {
  const loginPage = this.get<LoginPage>('loginPage');
  await loginPage.assertLoginPageVisible();
});
