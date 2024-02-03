describe('Logins Manageent page functionality', () => {
  beforeEach(() => {
    Cypress.once('uncaught:exception', () => false) // added to suppress uncaught exception error, that is not affecting the test
    // full link located in cypress.config.js
    cy.visit('/account/signin');
    cy.get('[ng-model="username"]').type(Cypress.env('user_name'), {log: false}); //Fill in the username 
    cy.get("#password").type(Cypress.env('user_password'), {log: false});// Fill in the password
    cy.get('[type="submit"]').click(); // Click on the Sign In button
    cy.contains('Settings').click(); // Navigate to Settings page
    cy.contains('Shared Logins and Services').click(); // Navigate to Logins Management page
    // cy.wait(2000);
  });
  
  it('Required logins Update button', () => {
    cy.get('.erp-page-panel-body').contains('Required Logins').should('be.visible');// Assert that the Required Logins section is visible
    cy.get('.connected-account').contains('Website Logins').should('be.visible');// Assert that the Website Logins row is visible
    cy.contains('.connected-account','Website Logins').find('button').click(); // Click on the Update button
    // Verify that Submit button inactive until user changes the credentials
    cy.get('.modal-footer').contains('Submit Credentials').should('be.disabled');
    // Verify that Dismiss button is enabled
    cy.get('.modal-footer').contains('Dismiss').should('be.enabled');
    // Modify Credentials
    cy.get("#model_url").clear().type('https://www.google.ua');
    cy.get("#model_username").clear().type('xyz');
    cy.get("#model_password").clear().type('000');  
    cy.get('.modal-footer').contains('Submit Credentials').click();// Submit Credentials

    // Verify that Updated Credentials will appear after re-opening the modal
    cy.contains('.connected-account','Website Logins').find('button').click();
    cy.get("#model_url").should('have.value', 'https://www.google.ua');
    cy.get("#model_username").should('have.value', 'xyz')
    // // Verify that Dismiss button is working as expected
    cy.get("#model_url").clear().type('https://yahoo.com'); // Modify Credentials
    cy.get("#model_username").clear().type('yyy');
    cy.get('.modal-footer').contains('Dismiss').click();//dismiss modified credentials
    cy.contains('.connected-account','Website Logins').find('button').click();
    cy.get("#model_url").should('have.value', 'https://www.google.ua'); //verify that the credentials are not updated
    cy.get("#model_username").should('have.value', 'xyz') //verify that the credentials are not updated
    cy.get('.modal-footer').contains('Dismiss').click();
  });

  it('Connect Other Accounts', () => { 
    cy.get('.erp-page-panel-body').contains('Other Accounts').should('exist');// Assert that the Other Accounts section is visible
    cy.get('.connected-account').contains('Stripe').should('be.visible');// Assert that the Stripe row is visible
    cy.get('.connected-account').then(($el) => {
      if ($el.text().includes('Disconnect')) {
        cy.get('.connected-account:contains("Stripe") .ol-link--tertiary').click();
        cy.get('.modal-footer').contains('Yes').click(); // Disconnect account
        cy.wait(2000);
        cy.contains('.connected-account', 'Stripe').find('button').click(); // Click on the Connect button
      } else {
        cy.contains('.connected-account', 'Stripe').find('button').click(); // Click on the Connect button          
      }
    });
    cy.origin('https://connect.stripe.com', () => {
      cy.url().should('include', 'https://connect.stripe.com/'); // Ensure app is redirected to the 3rd party authentication page
      cy.get('#skip-account-app').click(); // Click on the Skip button
    }) 
    cy.url().should('include', 'https://stage.dashboard.onelocal.com/');// Ensure user is redirected to the app 
    // Ensure that the account information matches (date, status)
    cy.get('.connected-account').contains('Since').should('be.visible');// Assert that the Since field is visible
    cy.get('.text-sm').eq(0).should('have.text', 'Since:');// Assert that the Since label is visible
    cy.get('.text-sm').eq(1).should('be.visible');// Assert that the Date label is visible
    cy.get('.connected-account').contains('Disconnect').should('be.visible');//Assert that the Disconnect button is visible
   
    cy.get('.text-sm').eq(1).invoke('text').then(dateText => {  // Get the date value from the field
      const dateInField = new Date(dateText); // Convert the date text to a JavaScript Date object
      const currentDate = new Date(); // Get the current date and time
      expect(dateInField.toDateString()).to.equal(currentDate.toDateString()); //Assert date in field is equal to the current date
    });
  });
});