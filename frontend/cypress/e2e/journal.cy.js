describe('Mood Tracker Critical Flow', () => {
  it('logs in and creates a journal entry', () => {
    cy.visit('http://localhost:5173/login')

    cy.get('[data-cy="email-input"]').type('nikolabryks@gmx.de')
    cy.get('[data-cy="password-input"]').type('2007')
    cy.get('[data-cy="login-button"]').click()

    cy.get('nav').contains('Journal').click()

    cy.get('[data-cy="new-entry-button"]').click()

    cy.get('[data-cy="entry-title-input"]').type('Cypress Test Entry')
    cy.get('[data-cy="entry-content-input"]').type('This entry was created by Cypress.')

    cy.get('[data-cy="save-entry-button"]').click()

    cy.contains('Cypress Test Entry').should('exist')
  })

  it('shows an error message when login password is wrong', () => {
    cy.visit('http://localhost:5173/login')

    cy.get('[data-cy="email-input"]').type('test@test.de')
    cy.get('[data-cy="password-input"]').type('wrong-password')
    cy.get('[data-cy="login-button"]').click()

    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'E-Mail oder Passwort ungültig.')
  })
})