import { test, expect, request } from '@playwright/test';
import { AccountApi } from './account.api';

test('Create, get and delete account through API', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://automationexercise.com',
  });

  const accountApi = new AccountApi(apiContext);

  const unique = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const user = {
    name: 'API Test User',
    email: `api.test.${unique}@example.com`,
    password: 'Test@1234',
  };

  // 1. CREATE ACCOUNT
  const createResponse = await accountApi.createAccount(user);
  const createBody = await createResponse.json();

  expect(createResponse.status()).toBe(200);
  expect(createBody.responseCode).toBe(201);
  expect(createBody.message).toBe('User created!');

  // 2. GET ACCOUNT
  const getResponse = await accountApi.getUserByEmail(user.email);
  const getBody = await getResponse.json();

  expect(getResponse.status()).toBe(200);
  expect(getBody.responseCode).toBe(200);
  expect(getBody.user.email).toBe(user.email);
  expect(getBody.user.name).toBe(user.name);

  // 3. DELETE ACCOUNT
  const deleteResponse = await accountApi.deleteAccount(
    user.email,
    user.password
  );
  const deleteBody = await deleteResponse.json();

  expect(deleteResponse.status()).toBe(200);
  expect(deleteBody.responseCode).toBe(200);
  expect(deleteBody.message).toBe('Account deleted!');

  await apiContext.dispose();
});

test('Verify login with invalid credentials through API', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://automationexercise.com',
  });

  const accountApi = new AccountApi(apiContext);

  const response = await accountApi.verifyLogin(
    `invalid.${Date.now()}@example.com`,
    'WrongPassword123'
  );

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(404);
  expect(body.message).toBe('User not found!');

  await apiContext.dispose();
});