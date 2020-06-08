describe('Player cards', () => {
  it('becomes selected when clicked if unselected', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=1')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-0]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-0]').click()
    cy.get('[data-testid=card-0]').should('have.attr', 'aria-pressed', 'true')
  })

  it('becomes unselected when selecting a different one', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=1')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-0]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-0]').click()
    cy.get('[data-testid=card-0]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid=card-1]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-1]').click()
    cy.get('[data-testid=card-0]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-1]').should('have.attr', 'aria-pressed', 'true')
  })

  it('cannot be interacted with if AI turn', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=0')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-0]').should('be.disabled')
    cy.get('[data-testid=card-1]').should('be.disabled')
    cy.get('[data-testid=card-2]').should('be.disabled')
  })
})

describe('Table cards', () => {
  it('cannot be interacted with if AI turn', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=0')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-6]').should('be.disabled')
    cy.get('[data-testid=card-7]').should('be.disabled')
    cy.get('[data-testid=card-8]').should('be.disabled')
    cy.get('[data-testid=card-9]').should('be.disabled')
  })

  it('becomes selected when clicked if unselected', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=1')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-6]').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'true')
  })

  it('becomes unselected when clicked if already selected', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=1')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-6]').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid=card-6]').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'false')
  })

  it('can be multiple selected', () => {
    cy.visit('/?noShuffle=1&isPlayerTurn=1')
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-7]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-8]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-9]').should('have.attr', 'aria-pressed', 'false')
    cy.get('[data-testid=card-6]').click()
    cy.get('[data-testid=card-7]').click()
    cy.get('[data-testid=card-8]').click()
    cy.get('[data-testid=card-9]').click()
    cy.get('[data-testid=card-6]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid=card-7]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid=card-8]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid=card-9]').should('have.attr', 'aria-pressed', 'true')
  })
})
