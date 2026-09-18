/**
 * Cucumber configuration with profiles:
 *  default    – all tests, pretty output, HTML + JSON reports
 *  smoke      – @smoke tags only, fast feedback loop
 *  regression – @regression tags, parallel, JSON + HTML
 *  ci         – full suite, Allure + JSON, retries, parallel
 */

const PATHS = 'src/features/**/*.feature';

const BASE_REQUIRE = [
  '--require-module ts-node/register',
  '--require-module tsconfig-paths/register',
  '--require src/support/world.ts',
  '--require src/support/hooks.ts',
  '--require src/step-definitions/**/*.steps.ts',
].join(' ');

const REPORTS = [
  '--format pretty',
  '--format json:reports/cucumber-report.json',
  '--format html:reports/cucumber-report.html',
  '--format allure-cucumberjs/reporter',
].join(' ');

const ALLURE_FORMAT = '--format allure-cucumberjs/reporter';

module.exports = {
  /** Local development — headed option via env, full HTML report */
  default: `
    ${PATHS}
    ${BASE_REQUIRE}
    ${REPORTS}
    --tags "not @skip"
    --retry 0
  `,

  /** Quick sanity — smoke-tagged scenarios only */
  smoke: `
    ${PATHS}
    ${BASE_REQUIRE}
    ${REPORTS}
    --tags "@smoke and not @payment and not @skip"
    --retry 0
  `,

  /** Full regression suite — parallel on 2 workers */
  regression: `
    ${PATHS}
    ${BASE_REQUIRE}
    ${REPORTS}
    --tags "@regression and not @payment and not @skip"
    --parallel 2
    --retry 1
  `,

  /** CI — Allure + JSON, 4 parallel workers, 1 retry */
  ci: `
    ${PATHS}
    ${BASE_REQUIRE}
    ${ALLURE_FORMAT}
    --format json:reports/cucumber-report.json
    --format html:reports/cucumber-report.html
    --tags "not @skip"
    --parallel 4
    --retry 1
  `,
};
