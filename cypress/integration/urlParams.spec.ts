describe('URL parameters', () => {
  describe('"preset"', () => {
    it('selects an initial preset config if valid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&preset=del15')
      cy.contains('sumen 15 puntos')
      cy.visit('/?noShuffle=1&isPlayerTurn=1&preset=del100')
      cy.contains('sumen 100 puntos')
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&preset=foobar')
      cy.contains('sumen 10 puntos')
    })
  })

  describe('"tableCardsAmount"', () => {
    it('defines the initial amount of cards on the table if valid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&tableCardsAmount=5')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=tableCards] > [data-testid^=card-]').should(
        'have.length',
        5
      )
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&tableCardsAmount=foobar')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=tableCards] > [data-testid^=card-]').should(
        'have.length',
        4
      )
    })
  })

  describe('"playerCardsAmount"', () => {
    it('defines the initial amount of cards for each player if valid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=2')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=aiCards] > [data-testid^=card-]').should(
        'have.length',
        2
      )
      cy.get('[data-testid=playerCards] > [data-testid^=card-]').should(
        'have.length',
        2
      )
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=foobar')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=aiCards] > [data-testid^=card-]').should(
        'have.length',
        3
      )
      cy.get('[data-testid=playerCards] > [data-testid^=card-]').should(
        'have.length',
        3
      )
    })
  })

  describe('"targetValue"', () => {
    it('defines the target value a play must add up to if valid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&targetValue=11')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=card-0]').click()
      cy.get('[data-testid=card-6]').click()
      cy.get('[data-testid=card-7]').click()
      cy.get('[data-testid=card-8]').click()
      cy.get('[data-testid=card-9]').click()
      cy.contains('Jugar').click()
      cy.contains('La máquina se descarta')
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&targetValue=foobar')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-testid=card-0]').click()
      cy.get('[data-testid=card-6]').click()
      cy.get('[data-testid=card-7]').click()
      cy.get('[data-testid=card-8]').click()
      cy.get('[data-testid=card-9]').click()
      cy.contains('Jugar').click()
      cy.contains('Las cartas elegidas no suman 10')
    })
  })

  describe('"cardType"', () => {
    it('defines the card design variant if valid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&cardType=number')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-cardtype="image"]').should('not.exist')
      cy.get('[data-cardtype="number"]').should('have.length.greaterThan', 0)
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=1&cardType=foobar')
      cy.contains('¡EMPEZAR!').click()
      cy.get('[data-cardtype="number"]').should('not.exist')
      cy.get('[data-cardtype="image"]').should('have.length.greaterThan', 0)
    })
  })

  describe('"pauseOnAiPlay"', () => {
    it('defines if user must confirm an AI play', () => {
      cy.clock()
      cy.visit('/?noShuffle=1&isPlayerTurn=0&pauseOnAiPlay=false')
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Esperando a que juegue la máquina...')
      cy.tick(800)
      cy.contains('La máquina juega')
      cy.clock().then((c) => c.restore())
      cy.contains('Tu Turno')
    })

    it('is ignored if invalid', () => {
      cy.visit('/?noShuffle=1&isPlayerTurn=0&pauseOnAiPlay=foobar')
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Esperando a que juegue la máquina...')
      cy.contains('La máquina juega')
      cy.contains('OK').click()
      cy.contains('Tu Turno')
    })
  })

  describe('"hintsDelay"', () => {
    it('defines the amount of seconds to wait before showing a hint', () => {
      cy.clock()
      cy.visit('/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=4&hintsDelay=1')
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Tu Turno')
      cy.tick(500)
      cy.get('[data-testid=card-0][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-8][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-9][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-10][data-ishinted=true]').should('not.exist')
      cy.tick(500)
      cy.get('[data-testid=card-0][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-8][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-9][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-10][data-ishinted=true]').should('exist')
    })

    it('disables hints if 0', () => {
      cy.clock()
      cy.visit('/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=4&hintsDelay=0')
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Tu Turno')
      cy.tick(60000)
      cy.get('[data-testid=card-0][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-8][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-9][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-10][data-ishinted=true]').should('not.exist')
    })

    it('is ignored if invalid', () => {
      cy.clock()
      cy.visit(
        '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=4&hintsDelay=foobar'
      )
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Tu Turno')
      cy.tick(4500)
      cy.get('[data-testid=card-0][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-8][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-9][data-ishinted=true]').should('not.exist')
      cy.get('[data-testid=card-10][data-ishinted=true]').should('not.exist')
      cy.tick(500)
      cy.get('[data-testid=card-0][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-8][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-9][data-ishinted=true]').should('exist')
      cy.get('[data-testid=card-10][data-ishinted=true]').should('exist')
    })
  })

  describe('"availableCards"', () => {
    it('defines the cards deck to use for the game if valid', () => {
      cy.visit(
        '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=1,2,3'
      )
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Tu Turno')
      cy.get('[data-testid^=card-]').should('have.length', 3)
      cy.get('[data-testid=card-0]').should('exist').should('have.text', '1')
      cy.get('[data-testid=card-2]').should('exist').should('have.text', '3')
      cy.get('[data-testid=card-1]')
        .should('exist')
        // reversed card
        .should('have.text', '')
    })

    it('is ignored if invalid', () => {
      cy.visit(
        '/?noShuffle=1&isPlayerTurn=1&playerCardsAmount=1&tableCardsAmount=1&availableCards=foobar'
      )
      cy.contains('¡EMPEZAR!').click()
      cy.contains('Tu Turno')
      cy.get('[data-testid^=card-]').should('have.length', 23)
    })
  })
})
