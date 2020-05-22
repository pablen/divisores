import * as defaults from './defaults'
import * as utils from './utils'

export function init({ shuffledStack, isPlayerTurn }, config = defaults) {
  if (
    config.tableCardsAmount + 2 * config.playerCardsAmount >
    config.availableCards.length
  ) {
    throw new Error('Insufficient cards in stack')
  }
  return {
    playerCards: shuffledStack.slice(0, config.playerCardsAmount),
    tableCards: shuffledStack.slice(
      2 * config.playerCardsAmount,
      2 * config.playerCardsAmount + config.tableCardsAmount
    ),
    stackCards: shuffledStack.slice(
      2 * config.playerCardsAmount + config.tableCardsAmount
    ),
    aiCards: shuffledStack.slice(
      config.playerCardsAmount,
      2 * config.playerCardsAmount
    ),

    selectedTableCards: [],
    selectedPlayerCard: null,

    playerStackLength: 0,
    aiStackLength: 0,

    playerSweeps: 0,
    aiSweeps: 0,

    isPlayerTurn,
    message: null,
    config,
  }
}

export function reducer(state, action) {
  console.log(action.type)
  switch (action.type) {
    case 'reset':
      return init(
        {
          shuffledStack: action.payload.shuffledStack,
          isPlayerTurn: action.payload.isPlayerTurn,
        },
        state.config
      )

    case 'config updated':
      return init(
        {
          shuffledStack: action.payload.shuffledStack,
          isPlayerTurn: action.payload.isPlayerTurn,
        },
        {
          ...state.config,
          ...action.payload.newConfig,
        }
      )

    case 'player card selected':
      return { ...state, selectedPlayerCard: action.payload, message: null }

    case 'player card discarded':
      return {
        ...state,
        isPlayerTurn: false,
        selectedPlayerCard: null,
        selectedTableCards: [],
        tableCards: [
          ...state.tableCards,
          state.playerCards[state.selectedPlayerCard],
        ],
        playerCards: state.playerCards.filter(
          (_, i) => i !== state.selectedPlayerCard
        ),
      }

    case 'table card selected':
      return {
        ...state,
        message: null,
        selectedTableCards: state.selectedTableCards.includes(action.payload)
          ? state.selectedTableCards.filter((v) => v !== action.payload)
          : [...state.selectedTableCards, action.payload],
      }

    case 'play attempted': {
      const isValidPlay =
        state.selectedTableCards.reduce(
          (acc, current) => acc + state.tableCards[current],
          state.playerCards[state.selectedPlayerCard]
        ) === state.config.targetValue

      if (!isValidPlay) {
        return {
          ...state,
          message: `Las cartas elegidas no suman ${state.config.targetValue}!`,
        }
      }

      const tableCards = state.tableCards.filter(
        (_, i) => !state.selectedTableCards.includes(i)
      )

      return {
        ...state,
        selectedTableCards: [],
        selectedPlayerCard: null,
        isPlayerTurn: false,
        tableCards,
        playerCards: state.playerCards.filter(
          (_, i) => i !== state.selectedPlayerCard
        ),
        playerStackLength:
          state.playerStackLength + state.selectedTableCards.length + 1,
        playerSweeps:
          tableCards.length === 0 ? state.playerSweeps + 1 : state.playerSweeps,
        message: null,
      }
    }

    case 'ai played': {
      const [cardIndex, ...tableIndixes] = utils.getBestPlay(
        state.aiCards,
        state.tableCards,
        state.config.targetValue
      )

      if (tableIndixes.length === 0) {
        console.log(`AI discarded a ${state.aiCards[cardIndex]}`)
        return {
          ...state,
          isPlayerTurn: true,
          tableCards: [...state.tableCards, state.aiCards[cardIndex]],
          aiCards: state.aiCards.filter((_, i) => i !== cardIndex),
        }
      }

      const tableCards = state.tableCards.filter(
        (_, i) => !tableIndixes.includes(i)
      )

      console.log(
        `AI played a ${state.aiCards[cardIndex]} and took ${tableIndixes
          .map((i) => state.tableCards[i])
          .join(', ')}`
      )

      return {
        ...state,
        isPlayerTurn: true,
        tableCards,
        aiCards: state.aiCards.filter((_, i) => i !== cardIndex),
        aiStackLength: state.aiStackLength + tableIndixes.length + 1,
        aiSweeps: tableCards.length === 0 ? state.aiSweeps + 1 : state.aiSweeps,
      }
    }

    case 'cards requested':
      return {
        ...state,
        playerCards: state.stackCards.slice(0, state.config.playerCardsAmount),
        stackCards: state.stackCards.slice(2 * state.config.playerCardsAmount),
        aiCards: state.stackCards.slice(
          state.config.playerCardsAmount,
          2 * state.config.playerCardsAmount
        ),
      }

    default:
      throw new Error(`Unknown action type ${action.type}`)
  }
}
