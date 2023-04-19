import { inventory } from '../pages/Inventory';
import { cart } from '../pages/Cart';
import { checkout } from '../pages/Checkout';
import { login } from '../pages/Login';

describe('Standard User Login', function () {
  beforeEach(function () {
    cy.fixture('itemsStandardUser.json').as('items');
    cy.fixture('sortingValues.json').as('values');
    cy.fixture('formUsers.json').as('users');
    cy.fixture('checkoutMessages.json').as('messages');
    cy.login('standardUsername');
  });

  it('should sort items by Price (low to high)', function () {
    inventory.validateItemsList();
    inventory.sortItems(this.values.lohi.value);
    inventory.validateDropdownSelectedValue(this.values.lohi.text);
    inventory.getDropdownValue().should('have.text', this.values.lohi.text);
    inventory.validateItem(
      0,
      this.items.onesie.name,
      this.items.onesie.price,
      this.items.onesie.src
    );
  });

  it('should add items to the cart', function () {
    inventory.sortItems(this.values.za.value);
    inventory.addAllItemstoCart();
    inventory.removeItem(this.items.tshirt.name);
    inventory.validateCartItems();
  });

  it('should validate the cart items', function () {
    inventory.addItemtoCart(this.items.redTshirt.name);
    inventory.clickShoppingCart();
    cy.validateUrl(Cypress.env('cartUrl'));
    cart.getCartItems().should('have.length', 1);
    cart.validateItem(0, this.items.redTshirt.name, this.items.redTshirt.price);
  });

  it('should validate checkout form errors', function () {
    inventory.clickShoppingCart();
    cart.clickCheckoutButton();
    checkout.submitForm();
    checkout.validateErrorIcons();
    checkout.validateErrorMessages();
  });

  it('should remove a cart item', function () {
    inventory.addItemtoCart(this.items.redTshirt.name);
    inventory.clickShoppingCart();
    cart.getCartItems().should('have.length', 1);
    cart.validateItem(0, this.items.redTshirt.name, this.items.redTshirt.price);
    cart.removeItem(this.items.redTshirt.name);
    cart.getCartItems().should('have.length', 0);
    cart.clickContinueShopping();
    cy.validateUrl(Cypress.env('inventoryUrl'));
  });

  it('should complete a payment', function () {
    inventory.addItemtoCart(this.items.redTshirt.name);
    inventory.addItemtoCart(this.items.bikeLight.name);
    inventory.addItemtoCart(this.items.backpack.name);
    inventory.clickShoppingCart();
    cart.clickCheckoutButton();
    cy.validateUrl(Cypress.env('checkoutUrl1'));
    checkout.fillForm(
      this.users.firstUser.firstName,
      this.users.firstUser.lastName,
      this.users.firstUser.code
    );
    checkout.submitForm();
    cy.validateUrl(Cypress.env('checkoutUrl2'));
    checkout.getCartItems().should('have.length', 3);
    checkout.validateTotalPrice();
    checkout.clickFinishButton();
    cy.validateUrl(Cypress.env('checkoutCompleted'));
    checkout.getTitle().should('contain', this.messages.title);
    checkout
      .getCheckoutCompletedContainer()
      .should('be.visible')
      .and('contain', this.messages.header);
    checkout.clickBackhomeButton();
    cy.validateUrl(Cypress.env('inventoryUrl'));
    cy.logout();
  });
});

describe('Error Users Login', function () {
  beforeEach(function () {
    cy.visit('/');
  });

  it('should validate login form errors', function () {
    login.submitForm();
    login.validateErrorMessages();
    login.validateNonExistingUser();
  });

  it('should validate locked out user', function () {
    cy.login('lockedUsername');
    login.validateLockedOutUser();
  });
});

describe('Failed User Login', function () {
  beforeEach(function () {
    cy.login('problemUsername');
    cy.fixture('itemsStandardUser.json').as('items');
    cy.fixture('sortingValues.json').as('values');
  });
  it('should sort items by Name (Z to A)', function () {
    inventory.sortItems(this.values.za.value);
    inventory.validateDropdownSelectedValue(this.values.za.text);
  });

  it('should validate an item', function () {
    inventory.validateItemsList();
    inventory.validateItem(
      1,
      this.items.bikeLight.name,
      this.items.bikeLight.price,
      this.items.bikeLight.src
    );
  });

  it('should remove an item from the inventory', function () {
    inventory.addAllItemstoCart();
    inventory.removeItem(this.items.tshirt.name);
  });

  it('should add items to the cart', function () {
    inventory.addItemtoCart(this.items.onesie.name);
    inventory.addItemtoCart(this.items.backpack.name);
    inventory.validateCartItems();
    inventory.clickShoppingCart();
    cart.validateItem(0, this.items.onesie.name, this.items.onesie.price);
    cart.removeItem(this.items.backpack.name);
    cy.logout();
  });

  it('should validate checkout errors', function () {
    inventory.addItemtoCart(this.items.backpack.name);
    inventory.clickShoppingCart();
    cart.clickContinueShopping();
    inventory.addItemtoCart(this.items.onesie.name);
    inventory.clickShoppingCart();
    cart.clickCheckoutButton();
    checkout.submitForm();
    checkout.validateErrorMessages();
  });
});

describe('Performance User Login', function () {
  beforeEach(function () {
    cy.login('performanceUsername');
    cy.fixture('itemsStandardUser.json').as('items');
    cy.fixture('sortingValues.json').as('values');
  });

  it('should sort items by Price (high to low)', function () {
    inventory.sortItems(this.values.hilo.value);
    inventory.validateDropdownSelectedValue(this.values.hilo.text);
    inventory.validateItem(
      0,
      this.items.jacket.name,
      this.items.jacket.price,
      this.items.jacket.src
    );
  });

  it('should add items by inventory item', function () {
    inventory.clickItem(this.items.onesie.name);
    cy.url().should('contain', Cypress.env('inventoryItemUrl'));
    inventory.getAddItemButton().click();
    inventory.getRemoveItemButton().should('be.visible');
    inventory.getBacktoProductButton().click();
    inventory.validateItemsList();
    cy.logout();
  });
});
