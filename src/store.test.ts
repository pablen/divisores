import { CardType, ConfigOptions } from './presets'
import { reducer, init, State } from './store'

const shuffledStack = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9]
const isPlayerTurn = true
const config: ConfigOptions = {
  availableCards: shuffledStack,
  targetValue: 10,
  tableCardsAmount: 3,
  playerCardsAmount: 2,
  cardType: 'image' as CardType,
  pauseOnAiPlay: true,
  hintsDelay: 5,
}

const baseInitParams = { shuffledStack, isPlayerTurn, config }

const baseInitState: State = {
  shuffledStack,
  isPlayerTurn,
  config,
  playerCards: [0, 1],
  aiCards: [2, 3],
  tableCards: [4, 5, 6],
  stackCards: [7, 8, 9, 10],
  selectedTableCards: [],
  selectedPlayerCard: null,
  selectedAiCard: null,
  playerStack: [],
  aiStack: [],
  hint: [],
  playerSweeps: 0,
  aiSweeps: 0,
  userMessage: null,
}

describe('Function init', () => {
  test('returns a valid initial state', async () => {
    expect(init(baseInitParams)).toEqual(baseInitState)
  })

  describe('throws when passed an incompatible config such as', () => {
    test('insufficient cards in deck', async () => {
      expect(() =>
        init({
          ...baseInitParams,
          config: { ...baseInitParams.config, availableCards: [1] },
        })
      ).toThrowError('Insufficient cards in deck')
    })

    test('some values in deck are too large', async () => {
      expect(() =>
        init({
          ...baseInitParams,
          config: {
            ...baseInitParams.config,
            availableCards: [...baseInitParams.config.availableCards, 10, 11],
          },
        })
      ).toThrowError(
        'Some values in the deck (10, 11) are greater or equal than the target value (10)'
      )
    })
  })
})

describe('Function reducer', () => {
  test('"reset" action sets a new game alternating current turn', async () => {
    expect(
      reducer(baseInitState, { type: 'reset', payload: { shuffledStack } })
    ).toEqual({ ...baseInitState, isPlayerTurn: !baseInitState.isPlayerTurn })
  })

  test('"config updated" restarts a game with new config keeping current turn', async () => {
    const newConfig = { ...config, targetValue: 15 }
    expect(
      reducer(baseInitState, {
        type: 'config updated',
        payload: { shuffledStack, newConfig },
      })
    ).toEqual({ ...baseInitState, config: newConfig })
  })

  test('"player card selected" selects a player card', async () => {
    expect(
      reducer(baseInitState, { type: 'player card selected', payload: 1 })
    ).toEqual({ ...baseInitState, selectedPlayerCard: 1 })
  })

  test('"player card selected" throws if selecting an invalid player card', async () => {
    expect(() =>
      reducer(baseInitState, { type: 'player card selected', payload: 10 })
    ).toThrowError('Player does not have a card with index 10')
  })

  test('"player card discarded" moves a card from player hand to the table', async () => {
    expect(
      reducer(
        { ...baseInitState, selectedPlayerCard: 1 },
        { type: 'player card discarded' }
      )
    ).toEqual({
      ...baseInitState,
      isPlayerTurn: false,
      selectedPlayerCard: null,
      tableCards: [...baseInitState.tableCards, 1],
      playerCards: [0],
    })
  })

  test('"player card discarded" throws if there is no selected card', async () => {
    expect(() =>
      reducer(baseInitState, { type: 'player card discarded' })
    ).toThrowError('Cannot discard card. None selected.')
  })

  test('"table card selected" selects a table card if not previously selected', async () => {
    expect(
      reducer(baseInitState, { type: 'table card selected', payload: 5 })
    ).toEqual({ ...baseInitState, selectedTableCards: [5] })
  })

  test('"table card selected" can select multiple cards', async () => {
    expect(
      reducer(
        reducer(baseInitState, { type: 'table card selected', payload: 5 }),
        { type: 'table card selected', payload: 6 }
      )
    ).toEqual({ ...baseInitState, selectedTableCards: [5, 6] })
  })

  test('"table card selected" deselects a table card if already selected', async () => {
    expect(
      reducer(
        { ...baseInitState, selectedTableCards: [5, 6] },
        { type: 'table card selected', payload: 5 }
      )
    ).toEqual({ ...baseInitState, selectedTableCards: [6] })
  })

  test('"table card selected" throws if selecting an invalid table card', async () => {
    expect(() =>
      reducer(baseInitState, { type: 'table card selected', payload: 100 })
    ).toThrowError('Table does not have a card with index 100')
  })

  test('"play attempted" updates player cards, table cards and player deck if valid play', async () => {
    expect(
      reducer(
        { ...baseInitState, selectedTableCards: [4, 5], selectedPlayerCard: 1 },
        { type: 'play attempted' }
      )
    ).toEqual({
      ...baseInitState,
      isPlayerTurn: false,
      selectedTableCards: [],
      playerCards: [0],
      tableCards: [6],
      playerStack: [4, 5, 1],
    })
  })

  test('"play attempted" displays a message if invalid play', async () => {
    const initialState = {
      ...baseInitState,
      selectedTableCards: [4, 6],
      selectedPlayerCard: 1,
    }
    expect(reducer(initialState, { type: 'play attempted' })).toEqual({
      ...initialState,
      userMessage: `Las cartas elegidas no suman ${initialState.config.targetValue}!`,
    })
  })

  test('"play attempted" throws if no player card selected', async () => {
    expect(() =>
      reducer(baseInitState, { type: 'play attempted' })
    ).toThrowError('Cannot execute play. No player card selected.')
  })

  test('"hint requested" sets a best play if available', async () => {
    expect(reducer(baseInitState, { type: 'hint requested' })).toEqual({
      ...baseInitState,
      hint: [0, 4, 5],
    })
  })

  test('"hint requested" does nothing if there is no possible play', async () => {
    const initialState = {
      ...baseInitState,
      tableCards: [5, 6],
      stackCards: [4, 7, 8, 9, 10],
    }
    expect(reducer(initialState, { type: 'hint requested' })).toEqual(
      initialState
    )
  })

  test('"ai play requested" selectes AI and table cards for an AI play if available', async () => {
    const initialState = {
      ...baseInitState,
      aiCards: [2],
      tableCards: [3, 4, 5, 6],
    }
    expect(reducer(initialState, { type: 'ai play requested' })).toEqual({
      ...initialState,
      selectedAiCard: 2,
      selectedTableCards: [3, 5],
    })
  })

  test('"ai play requested" selects an AI card to discard if no possible play', async () => {
    const initialState = {
      ...baseInitState,
      aiCards: [2],
      tableCards: [3, 4, 6],
    }
    expect(reducer(initialState, { type: 'ai play requested' })).toEqual({
      ...initialState,
      selectedAiCard: 2,
      selectedTableCards: [],
    })
  })

  test('"ai play accepted" and "ai played" updates AI cards, table cards and AI deck if valid play', async () => {
    const initialState = {
      ...baseInitState,
      aiCards: [2],
      tableCards: [3, 4, 5, 6],
      selectedAiCard: 2,
      selectedTableCards: [3, 5],
    }
    const expectedState = {
      ...initialState,
      aiCards: [],
      tableCards: [4, 6],
      selectedAiCard: null,
      selectedTableCards: [],
      aiStack: [...initialState.aiStack, 3, 5, 2],
    }
    expect(reducer(initialState, { type: 'ai play accepted' })).toEqual(
      expectedState
    )
    expect(reducer(initialState, { type: 'ai played' })).toEqual(expectedState)
  })

  test('"ai play accepted" and "ai played" moves selected card to the table if there is no valid play', async () => {
    const initialState = { ...baseInitState, selectedAiCard: 2 }
    const expectedState = {
      ...initialState,
      aiCards: [3],
      tableCards: [4, 5, 6, 2],
      selectedAiCard: null,
    }
    expect(reducer(initialState, { type: 'ai play accepted' })).toEqual(
      expectedState
    )
    expect(reducer(initialState, { type: 'ai played' })).toEqual(expectedState)
  })

  test('"ai play accepted" and "ai played" throws if no selected AI card', async () => {
    expect(() =>
      reducer(baseInitState, { type: 'ai play accepted' })
    ).toThrowError('Cannot execute play. No AI card selected.')
    expect(() => reducer(baseInitState, { type: 'ai played' })).toThrowError(
      'Cannot execute play. No AI card selected.'
    )
  })

  test('"new cards requested" updates player, AI and deck cards', async () => {
    const initialState = {
      ...baseInitState,
      playerCards: [],
      aiCards: [],
      stackCards: [7, 8, 9, 10],
      playerStack: [0, 1],
      aiStack: [2, 3],
    }
    const expectedState = {
      ...initialState,
      playerCards: [7, 8],
      aiCards: [9, 10],
      stackCards: [],
    }
    expect(reducer(initialState, { type: 'new cards requested' })).toEqual(
      expectedState
    )
  })
})
