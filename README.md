# Playwright + TypeScript + Cucumber BDD — E2E Automation Framework

Practical end-to-end UI test automation framework for
[automationexercise.com](https://automationexercise.com), built with
**Playwright**, **TypeScript**, and **Cucumber (BDD)**, integrated with
**Jenkins CI/CD** and **Allure** reporting.

---

## ✨ Features

- **Cucumber BDD** — readable `Given / When / Then` scenarios in plain English
- **Page Object Model (POM)** — one class per page, all locators + actions encapsulated
- **TypeScript strict mode** — compile-time safety across pages, steps, and utilities
- **JSON-driven test data** — credentials, products, and payment data live outside the code
- **Multi-browser** — Chromium, Firefox, WebKit via a single env variable
- **Tag-based execution** — `@smoke`, `@regression`, `@skip` profiles for fast or full runs
- **Auto screenshot + trace on failure** — attached directly to the report
- **Allure & Cucumber HTML reports** — rich, shareable test reports
- **Jenkins declarative pipeline** — lint → typecheck → test → report, fully parameterized
- **Centralized config** — `.env` for all environment-specific values

---

## 📁 Project Structure

```
.
├── Jenkinsfile                      # CI/CD pipeline (declarative)
├── cucumber.js                      # Cucumber profiles (default/smoke/regression/ci)
├── playwright.config.ts             # Re-exports shared browser defaults
├── tsconfig.json                    # Strict TS config + path aliases
├── package.json
├── .env.example                     # Copy → .env and customize
├── .eslintrc.js
├── .gitignore
│
└── src/
    ├── features/                    # Gherkin .feature files
    │   ├── auth/login.feature
    │   ├── products/product-search.feature
    │   └── cart/{cart,checkout}.feature
    │
    ├── step-definitions/            # Step implementations (mirrors features/)
    │   ├── common/common.steps.ts
    │   ├── auth/login.steps.ts
    │   ├── products/products.steps.ts
    │   └── cart/{cart,checkout}.steps.ts
    │
    ├── pages/                       # Page Object Model
    │   ├── base.page.ts             # Shared actions & assertions
    │   ├── home.page.ts
    │   ├── login.page.ts
    │   ├── products.page.ts
    │   ├── cart.page.ts
    │   └── checkout.page.ts
    │
    ├── support/                     # Cucumber World + lifecycle hooks
    │   ├── world.ts                 # Custom World — page/context/browser
    │   ├── hooks.ts                 # Before/After — launch, screenshot, trace
    │   └── playwright-defaults.ts   # Shared launch/context options
    │
    ├── data/                        # JSON test data (data-driven testing)
    │   ├── users.json
    │   ├── products.json
    │   └── checkout.json
    │
    └── utils/
        ├── env.ts                   # Typed .env loader
        ├── logger.ts                # Structured logger
        └── test-data.ts             # Typed JSON data loaders
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone <your-repo-url>
cd playwright-typescript-cucumber-framework
npm install                # also runs `playwright install chromium` via postinstall
cp .env.example .env       # adjust BASE_URL, BROWSER, etc.
```


### Test account handling

Authentication and checkout scenarios do **not** depend on fake hard-coded credentials. For scenarios tagged `@auth` or `@checkout`, the framework creates a unique temporary test account through the Automation Exercise API before the scenario and attempts to delete it during teardown. This keeps the login and checkout flows repeatable.

The target site's API documents `POST /api/createAccount` for account creation and `DELETE /api/deleteAccount` for cleanup.

### Running Tests

```bash
# All tests (everything except @skip)
npm test

# Smoke suite only — fast feedback
npm run test:smoke

# Full regression suite — parallel
npm run test:regression

# CI profile — Allure report, parallel, retries
npm run test:ci

# Run headed (visible browser) for debugging
npm run test:headed

# Run on a different browser
npm run test:firefox
npm run test:webkit
```

### Reports

```bash
# Cucumber HTML report (always generated)
open reports/cucumber-report.html

# Allure report (after `npm run test:ci`)
npm run allure:generate
npm run allure:open

# Or generate + open in one step
npm run allure:serve
```

### Code Quality

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run typecheck      # tsc --noEmit
```

---

## ⚙️ Configuration (`.env`)

| Variable                | Default                          | Description                              |
|--------------------------|-----------------------------------|--------------------------------------------|
| `BASE_URL`               | `https://automationexercise.com` | Target application URL                    |
| `BROWSER`                | `chromium`                       | `chromium` \| `firefox` \| `webkit`       |
| `HEADLESS`               | `true`                            | Run browser headless                      |
| `SLOW_MO`                | `0`                               | Delay (ms) between actions — debugging    |
| `TIMEOUT`                | `30000`                           | Default action/assertion timeout (ms)     |
| `SCREENSHOT_ON_FAILURE`  | `true`                            | Capture screenshot on scenario failure    |
| `TRACE_ON_FAILURE`       | `true`                            | Save Playwright trace on failure          |
| `RECORD_VIDEO`           | `false`                           | Record video for every scenario           |
| `TEST_ENV`               | `dev`                             | Logical environment label (dev/staging/prod) |
| `LOG_LEVEL`              | `INFO`                            | `DEBUG` \| `INFO` \| `WARN` \| `ERROR`     |

---

## 🏷️ Tagging Strategy

| Tag           | Purpose                                              |
|----------------|------------------------------------------------------|
| `@smoke`       | Critical-path scenarios — run on every commit       |
| `@regression`  | Full functional coverage — run nightly / pre-release |
| `@skip`        | Temporarily disabled (flaky/blocked) — excluded everywhere |
| `@auth` / `@products` / `@cart` / `@checkout` | Feature-area grouping for targeted runs |

Run a custom tag expression directly:

```bash
npx cucumber-js --profile default --tags "@cart and not @skip"
```

---

## 🧱 Architecture Notes

- **`BasePage`** centralizes every Playwright interaction (click, fill, assertions)
  so page objects stay declarative and DRY.
- **`CustomWorld`** gives every step access to `this.page`, `this.context`,
  `this.browser`, plus a typed `set/get` bag for passing data between steps
  (e.g. the `ProductsPage` instance created in one step is reused in the next).
- **`hooks.ts`** launches a fresh browser/context per scenario for full isolation,
  and automatically attaches a screenshot + Playwright trace to the report on failure.
- **Path aliases** (`@pages/*`, `@support/*`, etc.) are configured in `tsconfig.json`
  and resolved at runtime via `tsconfig-paths`.

---

## 🔄 CI/CD — Jenkins

The included `Jenkinsfile`:

1. Checks out source
2. Installs dependencies (`npm ci`)
3. Installs Playwright browsers
4. Runs **ESLint** and **TypeScript** checks in parallel
5. Executes the chosen Cucumber profile (parameterized: profile, browser, tags)
6. Generates and publishes the **Allure** report
7. Publishes the **Cucumber HTML** report
8. Archives screenshots, traces, and videos as build artifacts

Configure a `BASE_URL` credential in Jenkins before running the pipeline.

---

## 📦 Extending the Framework

1. **New page** → add `src/pages/<name>.page.ts` extending `BasePage`.
2. **New feature** → add `src/features/<area>/<name>.feature` with appropriate tags.
3. **New steps** → add `src/step-definitions/<area>/<name>.steps.ts`.
4. **New test data** → add a JSON file under `src/data/` and a typed accessor in
   `src/utils/test-data.ts`.

---

## 📄 License

MIT
