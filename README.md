# Playwright + TypeScript + Cucumber BDD — E2E Automation Framework

Practical end-to-end **UI and API test automation framework** for
[Automation Exercise](https://automationexercise.com), built with
**Playwright**, **TypeScript**, and **Cucumber BDD**.

The framework includes **Page Object Model**, reusable test utilities,
API automation, **Allure reporting**, failure screenshots and traces,
**Jenkins pipeline support**, and **GitHub Actions CI**.

---

## ✨ Features

- **Playwright** — modern browser automation for end-to-end testing
- **TypeScript** — strict typing and compile-time safety
- **Cucumber BDD** — readable `Given / When / Then` scenarios
- **Page Object Model (POM)** — locators and page actions encapsulated by page
- **Reusable BasePage** — centralized actions and assertions
- **Cucumber Custom World** — shared browser, context, page, and test state
- **Hooks** — browser lifecycle, test setup, cleanup, screenshots, and traces
- **JSON-driven test data** — users, products, and checkout data maintained separately
- **Multi-browser support** — Chromium, Firefox, and WebKit
- **Tag-based execution** — smoke, regression, feature-level filtering, and payment isolation
- **API automation** — POST, GET, DELETE, and negative authentication testing
- **API + UI test-data setup** — API-created accounts are used by UI scenarios
- **Allure reporting** — graphical test execution reports
- **Cucumber HTML reports** — shareable HTML execution reports
- **Failure screenshots** — captured when a scenario fails
- **Playwright traces** — captured for debugging failed scenarios
- **Environment-based configuration** — values managed through `.env`
- **ESLint** — code quality and consistency
- **TypeScript type checking** — compile-time validation
- **GitHub Actions CI** — automated regression and API execution
- **Jenkins declarative pipeline** — CI pipeline support with configurable execution
- **Git-based version control** — GitHub repository with reproducible project setup

---

## 🎯 Application Under Test

**Application:**

[Automation Exercise](https://automationexercise.com)

The framework automates common e-commerce workflows including:

- Login
- Logout
- Product listing
- Product search
- Add product to cart
- Add multiple products to cart
- Cart validation
- Remove product from cart
- Checkout
- Delivery address verification
- Order review verification
- API account management

---

## 📊 Verified Test Coverage

### UI Automation

- Valid login
- Invalid login validation
- Logout validation
- Product listing
- Product search
- Add single product to cart
- Add multiple products to cart
- Cart item validation
- Remove product from cart
- Checkout flow through payment stage
- Delivery address validation
- Order review validation

### API Automation

- Create account — `POST`
- Get account details — `GET`
- Delete account — `DELETE`
- Invalid login validation — negative API test
- HTTP status validation
- Application-level response code validation
- Response body assertions
- API test-data creation and cleanup

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── qa.yml                    # GitHub Actions CI workflow
│
├── Jenkinsfile                        # Jenkins declarative pipeline
├── cucumber.js                       # Cucumber profiles and formatters
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
├── package-lock.json
├── .nvmrc                            # Node.js version
├── .env.example                      # Environment configuration template
├── .eslintrc.js                      # ESLint configuration
├── .gitignore
├── LICENSE
├── README.md
│
└── src/
    │
    ├── api/                          # API automation
    │   ├── account.api.ts            # Reusable account API client
    │   └── account.api.spec.ts       # API test cases
    │
    ├── features/                     # Cucumber Gherkin feature files
    │   ├── auth/
    │   │   └── login.feature
    │   │
    │   ├── products/
    │   │   └── product-search.feature
    │   │
    │   └── cart/
    │       ├── cart.feature
    │       └── checkout.feature
    │
    ├── step-definitions/             # Cucumber step implementations
    │   ├── common/
    │   │   └── common.steps.ts
    │   ├── auth/
    │   │   └── login.steps.ts
    │   ├── products/
    │   │   └── products.steps.ts
    │   └── cart/
    │       ├── cart.steps.ts
    │       └── checkout.steps.ts
    │
    ├── pages/                        # Page Object Model
    │   ├── base.page.ts              # Shared actions and assertions
    │   ├── home.page.ts
    │   ├── login.page.ts
    │   ├── products.page.ts
    │   ├── cart.page.ts
    │   └── checkout.page.ts
    │
    ├── support/                      # Cucumber framework support
    │   ├── world.ts                  # Custom World
    │   ├── hooks.ts                  # Before / After hooks
    │   └── playwright-defaults.ts    # Shared browser/context options
    │
    ├── data/                         # JSON-based test data
    │   ├── users.json
    │   ├── products.json
    │   └── checkout.json
    │
    └── utils/
        ├── env.ts                    # Typed environment loader
        ├── logger.ts                 # Structured logger
        └── test-data.ts              # Typed JSON data loaders
