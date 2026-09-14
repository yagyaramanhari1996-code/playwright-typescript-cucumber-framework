@cart
Feature: Shopping Cart
  As a shopper
  I want to add products to my cart and review them
  So that I can verify my order before checkout

  Background:
    Given I am on the home page
    When I navigate to the products page

  @smoke @regression
  Scenario: Add a product to cart and verify it appears in the cart
    When I add the product at position 1 to the cart
    And I view my cart from the confirmation modal
    Then my cart should contain 1 item

  @regression
  Scenario: Add multiple products to cart
    When I add the product at position 1 to the cart
    And I continue shopping
    And I add the product at position 2 to the cart
    And I view my cart from the confirmation modal
    Then my cart should contain 2 items

  @regression
  Scenario: Remove a product from the cart
    When I add the product at position 1 to the cart
    And I view my cart from the confirmation modal
    And I remove the product at position 1 from the cart
    Then my cart should be empty
