@auth
Feature: User Login
  As a registered user
  I want to log in to my account
  So that I can access my profile and place orders

  Background:
    Given I am on the home page
    When I navigate to the login page

  @smoke @regression
  Scenario: Successful login with valid credentials
    When I login with configured valid credentials
    Then I should be logged in as "Playwright Automation User"

  @regression
  Scenario Outline: Failed login with invalid credentials
    When I login with email "<email>" and password "<password>"
    Then I should see a login error message

    Examples:
      | email                              | password      |
      | test.automation.user@example.com   | WrongPass123   |
      | no.such.user@example.com           | Test@1234      |

  @regression @skip
  Scenario: Login attempt with empty password
    When I login with email "test.automation.user@example.com" and password ""
    Then I should see a login error message

  @smoke @regression
  Scenario: Logout redirects to login page
    Given I login with configured valid credentials
    And I should be logged in as "Playwright Automation User"
    When I logout from the application
    Then I should see the login page
