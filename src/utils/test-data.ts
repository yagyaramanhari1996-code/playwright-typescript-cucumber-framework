import * as path from 'path';
import * as fs from 'fs';

const DATA_DIR = path.resolve(__dirname, '../data');

/** Generic JSON loader with caching so each file is read once per run */
const cache = new Map<string, unknown>();

function load<T>(filename: string): T {
  if (cache.has(filename)) return cache.get(filename) as T;

  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as T;
  cache.set(filename, parsed);
  return parsed;
}

// ── Typed shapes ────────────────────────────────────────────────────────────

export interface ValidUser {
  name: string;
  email: string;
  password: string;
}

export interface InvalidLoginAttempt {
  scenario: string;
  email: string;
  password: string;
}

export interface UsersData {
  validUser: ValidUser;
  invalidLoginAttempts: InvalidLoginAttempt[];
  newSignupUser: { name: string; email: string };
}

export interface SearchTerm {
  term: string;
  expectedMinResults: number;
}

export interface ProductsData {
  searchTerms: SearchTerm[];
  productsToAddToCart: { index: number; name: string }[];
}

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface CheckoutData {
  payment: PaymentDetails;
  orderComment: string;
}

// ── Public accessors ───────────────────────────────────────────────────────

export const usersData = (): UsersData => load<UsersData>('users.json');
export const productsData = (): ProductsData => load<ProductsData>('products.json');
export const checkoutData = (): CheckoutData => load<CheckoutData>('checkout.json');
