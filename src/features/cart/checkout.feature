@cart @checkout
Feature: Checkout
  As a logged-in user
  I want to check out the products in my cart
  So that I can complete my purchase

  @smoke @regression @payment
  Scenario: Complete checkout end-to-end with valid payment details
    Given I am on the home page
    And I login with configured valid credentials
    When I navigate to the products page
    And I add the product at position 1 to the cart
    And I view my cart from the confirmation modal
    And I proceed to checkout
    Then I should see my delivery address and order review
    When I add an order comment "Please deliver between 9 AM and 6 PM. Automated test order — no action needed."
    And I place the order
    And I enter valid payment details
    And I confirm the payment
    Then my order should be placed successfully


