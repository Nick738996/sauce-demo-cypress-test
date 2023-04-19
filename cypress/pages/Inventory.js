export class Inventory {
  // Elements
  constructor() {
    this.inventoryItem = '.inventory_item';
    this.cartContainer = '#shopping_cart_container';
    this.inventoryItemDescription = '.inventory_item_description';
    this.sortingDropdown = '[data-test="product_sort_container"]';
    this.activeDropdownValue = '.active_option';
    this.addButton = '.btn_primary';
    this.removeButton = '.btn_secondary';
    this.backtoProductsButton = '[data-test="back-to-products"]';
  }

  getRemoveItemButton() {
    return cy.contains('button', 'Remove');
  }

  getInventoryDescription() {
    return cy.get(this.inventoryItem).children(this.getInventoryDescription);
  }

  getCart() {
    return cy.get(this.cartContainer);
  }

  getItems() {
    return cy.get(this.inventoryItem);
  }

  getDropdownValue() {
    return cy.get(this.activeDropdownValue);
  }

  getAddItemButton() {
    return cy.get(this.addButton);
  }

  getBacktoProductButton() {
    return cy.get(this.backtoProductsButton);
  }

  sortItems(value) {
    cy.get(this.sortingDropdown).select(value);
    return this;
  }

  validateDropdownSelectedValue(text) {
    return this.getDropdownValue().should('contain', text);
  }

  validateItem(index, itemName, itemPrice, itemImgSrc) {
    this.getItems()
      .eq(index)
      .then(item => {
        cy.wrap(item).should('contain', itemName);
        cy.wrap(item).should('contain', itemPrice);
        cy.wrap(item).find('img').should('have.attr', 'src', itemImgSrc);
      });
    return this;
  }

  validateItemsList() {
    return this.getItems().should('have.length', 6);
  }

  addAllItemstoCart() {
    cy.get(this.inventoryItemDescription).each($el => {
      cy.wrap($el).find(this.addButton).click();
      cy.wrap($el).find(this.removeButton).should('be.visible');
    });
    return this;
  }

  addItemtoCart(itemName) {
    this.getInventoryDescription().each($el => {
      if ($el.text().includes(itemName)) {
        cy.wrap($el)
          .find(this.addButton)
          .should('contain', 'Add to cart')
          .click();
        cy.wrap($el).find(this.removeButton).should('contain', 'Remove');
      }
    });
    return this;
  }

  validateCartItems() {
    cy.get('.btn_secondary')
      .its('length')
      .then(items => {
        this.getCart().should('contain', items);
      });
    return this;
  }

  removeItem(itemName) {
    this.getInventoryDescription().each($el => {
      if ($el.text().includes(itemName)) {
        this.getRemoveItemButton().click();
        cy.wrap($el).find(this.addButton).should('be.visible');
      }
    });
    return this;
  }

  clickShoppingCart() {
    return this.getCart().click();
  }

  clickItem(itemName) {
    this.getInventoryDescription().contains(itemName).click();
    return this;
  }
}
export const inventory = new Inventory();
