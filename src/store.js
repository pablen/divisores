import { isDebugEnabled } from './config'
import * as utils from './utils'

const range = (start, amount) => Array.from(Array(amount), (_, i) => i + start)

export function init({ shuffledStack, isPlayerTurn, config }) {
  if (
    config.tableCardsAmount + 2 * config.playerCardsAmount >
    config.availableCards.length
  ) {
    throw new Error('Insufficient cards in stack')
  }
  return {
    playerCards: range(0, config.playerCardsAmount),
    tableCards: range(2 * config.playerCardsAmount, config.tableCardsAmount),
    aiCards: range(config.playerCardsAmount, config.playerCardsAmount),

    stackCards: range(
      2 * config.playerCardsAmount + config.tableCardsAmount,
      Math.floor(
        (shuffledStack.length -
          config.tableCardsAmount -
          2 * config.playerCardsAmount) /
          (2 * config.playerCardsAmount)
      ) *
        2 *
        config.playerCardsAmount
    ),

    shuffledStack,

    selectedTableCards: [],
    selectedPlayerCard: null,
    selectedAiCard: null,

    playerStack: [],
    aiStack: [],

    hint: [],

    playerSweeps: 0,
    aiSweeps: 0,

    isPlayerTurn,
    message: null,
    config,
  }
}

export function reducer(state, action) {
  if (isDebugEnabled) {
    console.groupCollapsed(action.type)
    console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action)
    console.log('%cPrevious State:', 'color: #9E9E9E; font-weight: 700;', state)
    console.groupEnd()
  }

  switch (action.type) {
    case 'reset':
      return init({
        shuffledStack: action.payload.shuffledStack,
        isPlayerTurn: !state.isPlayerTurn, // alternate first turn each game
        config: state.config,
      })

    case 'config updated':
      return init({
        shuffledStack: action.payload.shuffledStack,
        isPlayerTurn: action.payload.isPlayerTurn,
        config: { ...state.config, ...action.payload.newConfig },
      })

    case 'player card selected':
      return { ...state, selectedPlayerCard: action.payload, message: null }

    case 'player card discarded':
      return {
        ...state,
        isPlayerTurn: false,
        selectedPlayerCard: null,
        selectedTableCards: [],
        hint: [],
        message: null,
        tableCards: [...state.tableCards, state.selectedPlayerCard],
        playerCards: state.playerCards.filter(
          (v) => v !== state.selectedPlayerCard
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
          (acc, current) => acc + state.shuffledStack[current],
          state.shuffledStack[state.selectedPlayerCard]
        ) === state.config.targetValue

      if (!isValidPlay) {
        return {
          ...state,
          message: `Las cartas elegidas no suman ${state.config.targetValue}!`,
        }
      }

      const tableCards = state.tableCards.filter(
        (v) => !state.selectedTableCards.includes(v)
      )

      return {
        ...state,
        selectedTableCards: [],
        selectedPlayerCard: null,
        isPlayerTurn: false,
        tableCards,
        playerCards: state.playerCards.filter(
          (v) => v !== state.selectedPlayerCard
        ),
        playerStack: [
          ...state.playerStack,
          ...state.selectedTableCards,
          state.selectedPlayerCard,
        ],
        playerSweeps:
          tableCards.length === 0 ? state.playerSweeps + 1 : state.playerSweeps,
        message: null,
        hint: [],
      }
    }

    case 'hint requested': {
      const hint = utils.getBestPlay(
        state.playerCards,
        state.tableCards,
        state.shuffledStack,
        state.config.targetValue
      )
      return hint.length > 1 ? { ...state, hint } : state
    }

    case 'ai play requested': {
      const [cardIndex, ...tableIndixes] = utils.getBestPlay(
        state.aiCards,
        state.tableCards,
        state.shuffledStack,
        state.config.targetValue
      )

      return {
        ...state,
        selectedAiCard: cardIndex,
        selectedTableCards: tableIndixes,
      }
    }

    case 'ai play accepted':
    case 'ai played': {
      if (state.selectedTableCards.length === 0) {
        return {
          ...state,
          selectedAiCard: null,
          isPlayerTurn: true,
          tableCards: [...state.tableCards, state.selectedAiCard],
          aiCards: state.aiCards.filter((v) => v !== state.selectedAiCard),
        }
      }

      const tableCards = state.tableCards.filter(
        (v) => !state.selectedTableCards.includes(v)
      )

      return {
        ...state,
        isPlayerTurn: true,
        selectedTableCards: [],
        selectedAiCard: null,
        tableCards,
        aiCards: state.aiCards.filter((v) => v !== state.selectedAiCard),
        aiStack: [
          ...state.aiStack,
          ...state.selectedTableCards,
          state.selectedAiCard,
        ],
        aiSweeps: tableCards.length === 0 ? state.aiSweeps + 1 : state.aiSweeps,
      }
    }

    case 'new cards requested':
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
