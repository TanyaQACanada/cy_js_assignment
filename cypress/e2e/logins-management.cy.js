describe('Update Button Functionality', () => {
  
  it('should update and submit credentials', () => {
    Cypress.once('uncaught:exception', () => false) // added to suppress uncaught exception error, that is not affecting the test
    // full link located in cypress.config.js
    cy.visit('/account/signin');
    cy.get('[ng-model="username"]').type(Cypress.env('user_name'), {log: false}); //Fill in the username 
    cy.get("#password").type(Cypress.env('user_password'), {log: false});// Fill in the password
    cy.get('[type="submit"]').click(); // Click on the Sign In button
    cy.contains('Settings').click(); // Navigate to Settings page
    cy.contains('Shared Logins and Services').click(); // Navigate to Logins Management page
    cy.get('.erp-page-panel-body').contains('Required Logins').should('be.visible');// Assert that the Required Logins section is visible
    cy.get('.connected-account').contains('Website Logins').should('be.visible');// Assert that the Website Logins row is visible
    cy.contains('.connected-account','Website Logins').find('button').click(); // Click on the Update buttonq`w3efS
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
});
