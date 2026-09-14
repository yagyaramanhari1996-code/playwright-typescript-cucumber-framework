@products
Feature: Product Search
  As a visitor
  I want to search for products
  So that I can find items I'm interested in buying

  Background:
    Given I am on the home page
    When I navigate to the products page

  @smoke @regression
  Scenario: View all products listing
    Then I should see a list of all products

  @regression
  Scenario Outline: Search for a product by keyword
    When I search for the product "<searchTerm>"
    Then I should see "Searched Products" results
    And the search results should contain at least 1 product

    Examples:
      | searchTerm |
      | Top        |
      | Dress      |
      | Jeans      |

  @smoke @regression
  Scenario: Add a single product to the cart from the products page
    When I add the product at position 1 to the cart
    Then I should see the "Added!" confirmation modal
    And I continue shopping
