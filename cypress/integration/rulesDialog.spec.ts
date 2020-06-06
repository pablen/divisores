describe('Rules dialog', () => {
  it('is displayed on each run', () => {
    cy.visit('/')
    cy.contains('Reglas del juego')
    cy.reload(true)
    cy.contains('Reglas del juego')
  })

  it('is not displayed on each run after user requests so', () => {
    cy.visit('/')
    cy.contains('No volver a mostrar').click()
    cy.contains('¡EMPEZAR!').click()
    cy.reload(true)
    cy.contains('Reglas del juego').should('not.exist')
  })
})
