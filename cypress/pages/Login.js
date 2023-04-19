import { Checkout } from '../pages/Checkout';

export class Login extends Checkout {
  constructor() {
    super();
  }
  validateErrorMessages() {
    this.validateErrorIcons();
    cy.get('.form_group')
      .find('input')
      .each($input => {
        if ($input.text() === '') {
          let errorName = $input.prop('placeholder');
          this.getErrorMessage()
            .invoke('text')
            .should('contain', `Epic sadface: ${errorName} is required`);
          cy.wrap($input).type('Test');
          this.getErrorMessage().find('button').click();
          this.submitForm();
        }
      });
    return this;
  }

  validateNonExistingUser() {
    let nonExistingUserError =
      'Epic sadface: Username and password do not match any user in this service';
    this.getErrorMessage()
      .invoke('text')
      .should('contain', nonExistingUserError);
  }

  validateLockedOutUser() {
    let lockedUserError = 'Epic sadface: Sorry, this user has been locked out.';
    this.getErrorMessage().invoke('text').should('contain', lockedUserError);
  }
}

export const login = new Login();
