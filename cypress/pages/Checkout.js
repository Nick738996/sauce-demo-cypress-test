import { Cart } from '../pages/Cart';
export class Checkout extends Cart {
  constructor() {
    super();
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.PostalCodeInput = '[data-test="postalCode"]';
    this.taxPriceLabel = '.summary_tax_label';
    this.totalPriceLabel = '.summary_total_label';
    this.inventoryItemPrice = '.inventory_item_price';
    this.finishButton = '[data-test="finish"]';
    this.spanTitle = 'span.title';
    this.checkoutCompletedContainer = '#checkout_complete_container';
    this.backhomeButton = '[data-test="back-to-products"]';
    this.errorIcon = '[data-icon="times-circle"]';
    this.errorMessage = '[data-test="error"]';
  }

  getTitle() {
    return cy.get(this.spanTitle);
  }

  getCheckoutCompletedContainer() {
    return cy.get(this.checkoutCompletedContainer);
  }

  getFirstNameInput() {
    return cy.get(this.firstNameInput);
  }

  getLastNameInput() {
    return cy.get(this.lastNameInput);
  }

  getPostalCodeInput() {
    return cy.get(this.PostalCodeInput);
  }

  getErrorMessage() {
    return cy.get(this.errorMessage);
  }
  getForm() {
    return cy.get('form');
  }

  fillForm(firstName, lastName, postalCode) {
    this.getFirstNameInput().type(firstName);
    this.getLastNameInput().type(lastName);
    this.getPostalCodeInput().type(postalCode);
    return this;
  }

  submitForm() {
    this.getForm().submit();
  }

  validateTotalPrice() {
    cy.get(this.taxPriceLabel)
      .invoke('text')
      .then(tax => {
        let totalItemPrices = 0;
        let totalPrice = 0;
        let taxes = 0;
        taxes = parseFloat(tax.replace(/[^\d.-]/g, ''));
        cy.get(this.inventoryItemPrice).each($el => {
          cy.wrap($el)
            .invoke('text')
            .then(itemsTotal => {
              const itemsPrice = parseFloat(itemsTotal.replace(/[^\d.-]/g, ''));
              totalItemPrices += itemsPrice;
              totalPrice = totalItemPrices + taxes;
              cy.get(this.totalPriceLabel)
                .invoke('text')
                .then(totalPrice => {
                  cy.wrap(totalPrice).should('contain', totalPrice);
                });
            });
        });
      });
    return this;
  }
  clickFinishButton() {
    return cy.get(this.finishButton).click();
  }

  clickBackhomeButton() {
    return cy.get(this.backhomeButton).click();
  }

  validateErrorIcons() {
    this.getForm()
      .find(this.errorIcon)
      .each($el => {
        cy.wrap($el).should('be.visible');
      });
    return this;
  }

  validateErrorMessages() {
    this.validateErrorIcons();
    cy.get('.form_group')
      .find('input')
      .each($input => {
        if ($input.text() === '') {
          let errorName = $input.prop('placeholder');
          if (errorName === 'Zip/Postal Code') {
            errorName = 'Postal Code';
          }
          console.log(errorName);
          this.getErrorMessage()
            .invoke('text')
            .should('contain', `Error: ${errorName} is required`);
          cy.wrap($input).type('Test');
          this.getErrorMessage().find('button').click();
          this.submitForm();
        }
      });
    return this;
  }
}
export const checkout = new Checkout();
