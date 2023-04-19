import { Inventory } from '../pages/Inventory';
export class Cart extends Inventory {
  constructor() {
    super();
    this.cartItem = '.cart_item';
    this.cartItemLabel = '.cart_item_label';
    this.continueShoppingButton = '[data-test="continue-shopping"]';
    this.checkoutButton = '[data-test="checkout"]';
  }
  getCartItems() {
    return cy.get(this.cartItem);
  }
  clickContinueShopping() {
    return cy.get(this.continueShoppingButton).click();
  }
  clickCheckoutButton() {
    return cy.get(this.checkoutButton).click();
  }

  validateItem(index, itemName, itemPrice) {
    this.getCartItems()
      .eq(index)
      .then(item => {
        cy.wrap(item).contains(itemName);
        cy.wrap(item).contains(itemPrice);
      });
    return this;
  }
  removeItem(itemName) {
    this.getCartItems()
      .children(this.cartItemLabel)
      .each($el => {
        if ($el.text().includes(itemName)) {
          this.getRemoveItemButton().click();
        }
      });
    return this;
  }
}
export const cart = new Cart();
