describe('Game summary', () => {
  it('displays a Win message when the user won', () => {
    cy.visit(
      '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=1,2,9'
    )
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid="card-0"]').click()
    cy.get('[data-testid="card-2"]').click()
    cy.contains('[data-testid="play-btn"]', 'Jugar').click()
    cy.contains('OK').click()
    cy.contains('¡Ganaste!').click()
  })

  it('displays a Loose message when the user has lost', () => {
    cy.visit(
      '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=1,1,9'
    )
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid="card-0"]').click()
    cy.contains('[data-testid="play-btn"]', 'Descartar').click()
    cy.contains('OK').click()
    cy.contains('Perdiste').click()
  })

  it('displays a Tie message when the match is a tie', () => {
    cy.visit(
      '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=1,2,3'
    )
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid="card-0"]').click()
    cy.contains('[data-testid="play-btn"]', 'Descartar').click()
    cy.contains('OK').click()
    cy.contains('Empate').click()
  })

  it('displays the amount of cards, sweeps and total points', () => {
    cy.visit(
      '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=3&tableCardsAmount=1&availableCards=5,5,6,5,2,2,5'
    )
    cy.contains('¡EMPEZAR!').click()
    // Play #1
    cy.get('[data-testid="card-0"]').click()
    cy.get('[data-testid="card-6"]').click()
    cy.contains('[data-testid="play-btn"]', 'Jugar').click()
    cy.contains('OK').click()
    // Play #2
    cy.get('[data-testid="card-1"]').click()
    cy.get('[data-testid="card-3"]').click()
    cy.contains('[data-testid="play-btn"]', 'Jugar').click()
    cy.contains('OK').click()
    // Play #3
    cy.get('[data-testid="card-2"]').click()
    cy.contains('[data-testid="play-btn"]', 'Descartar').click()
    cy.contains('OK').click()

    cy.contains('[data-testid="playerPointsByCards"]', '1')
    cy.contains('[data-testid="aiPointsByCards"]', '0')
    cy.contains('[data-testid="playerPointsBySweeps"]', '2')
    cy.contains('[data-testid="aiPointsBySweeps"]', '1')
    cy.contains('[data-testid="playerPointsTotal"]', '3')
    cy.contains('[data-testid="aiPointsTotal"]', '1')
  })

  it('allows to start a new match alternating turns', () => {
    cy.clock()
    cy.visit(
      '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=1,1,9'
    )
    cy.contains('¡EMPEZAR!').click()
    cy.get('[data-testid="card-0"]').click()
    cy.contains('[data-testid="play-btn"]', 'Descartar').click()
    cy.tick(1200)
    cy.contains('OK').click()
    cy.tick(1200)
    cy.contains('Jugar De Nuevo').click()
    cy.contains('Esperando a que juegue la máquina...')
  })
})
