import { getBestPlay, CardIndex } from './utils'
import { isDebugEnabled } from './config'
import { ConfigOptions } from './presets'

export type State = {
  config: ConfigOptions
  isPlayerTurn: boolean

  /** A copy of availableCards that is randomly sorted at the start of each game */
  shuffledStack: ConfigOptions['availableCards']

  /**
   * The cards currently on the game deck.
   * Referenced as indices of the shuffledStack
   */
  stackCards: CardIndex[]

  /**
   * The cards currently on the table.
   * Referenced as indices of the shuffledStack
   */
  tableCards: CardIndex[]

  /**
   * The cards in the player hand.
   * Referenced as indices of the shuffledStack
   */
  playerCards: CardIndex[]

  /**
   * The cards in AI hand.
   * Referenced as indices of the shuffledStack
   */
  aiCards: CardIndex[]

  /**
   * The cards picked up by player plays.
   * Referenced as indices of the shuffledStack
   */
  playerStack: CardIndex[]

  /**
   * The cards picked up by AI plays.
   * Referenced as indices of the shuffledStack
   */
  aiStack: CardIndex[]

  /**
   * The cards for the best possible user play (if any).
   * Referenced as indices of the shuffledStack
   */
  hint: CardIndex[]

  /**
   * Table cards selected for the current play (IA or player).
   * Referenced as indices of the shuffledStack
   */
  selectedTableCards: CardIndex[]

  /**
   * Player card selected for the current play.
   * Referenced a an index of the shuffledStack
   */
  selectedPlayerCard: CardIndex | null

  /**
   * AI card selected for the current play.
   * Referenced an index of the shuffledStack
   */
  selectedAiCard: CardIndex | null

  /** The amount of player sweeps */
  playerSweeps: number

  /** The amount of AI sweeps */
  aiSweeps: number

  /** Optional feedback for the player */
  userMessage: string | null
}

export type Action =
  | {
      type: 'reset'
      payload: { shuffledStack: ConfigOptions['availableCards'] }
    }
  | {
      type: 'config updated'
      payload: {
        shuffledStack: ConfigOptions['availableCards']
        newConfig: ConfigOptions
      }
    }
  | { type: 'player card discarded' }
  | { type: 'player card selected'; payload: CardIndex }
  | { type: 'table card selected'; payload: CardIndex }
  | { type: 'new cards requested' }
  | { type: 'ai play requested' }
  | { type: 'ai play accepted' }
  | { type: 'play attempted' }
  | { type: 'hint requested' }
  | { type: 'ai played' }

export function reducer(state: State, action: Action): State {
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
        isPlayerTurn: state.isPlayerTurn,
        config: { ...state.config, ...action.payload.newConfig },
      })

    case 'player card selected':
      if (!state.playerCards.includes(action.payload)) {
        throw new Error(
          `Player does not have a card with index ${action.payload}`
        )
      }
      return { ...state, selectedPlayerCard: action.payload, userMessage: null }

    case 'player card discarded':
      if (typeof state.selectedPlayerCard !== 'number') {
        throw new Error('Cannot discard card. None selected.')
      }
      return {
        ...state,
        isPlayerTurn: false,
        selectedPlayerCard: null,
        selectedTableCards: [],
        hint: [],
        userMessage: null,
        tableCards: [...state.tableCards, state.selectedPlayerCard],
        playerCards: state.playerCards.filter(
          (v) => v !== state.selectedPlayerCard
        ),
      }

    case 'table card selected':
      if (!state.tableCards.includes(action.payload)) {
        throw new Error(
          `Table does not have a card with index ${action.payload}`
        )
      }
      return {
        ...state,
        userMessage: null,
        selectedTableCards: state.selectedTableCards.includes(action.payload)
          ? state.selectedTableCards.filter((v) => v !== action.payload)
          : [...state.selectedTableCards, action.payload],
      }

    case 'play attempted': {
      if (typeof state.selectedPlayerCard !== 'number') {
        throw new Error('Cannot execute play. No player card selected.')
      }
      const isValidPlay =
        state.selectedTableCards.reduce(
          (acc, current) => acc + state.shuffledStack[current],
          state.shuffledStack[state.selectedPlayerCard]
        ) === state.config.targetValue

      if (!isValidPlay) {
        return {
          ...state,
          userMessage: `Las cartas elegidas no suman ${state.config.targetValue}!`,
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
        userMessage: null,
        hint: [],
      }
    }

    case 'hint requested': {
      const hint = getBestPlay(
        state.playerCards,
        state.tableCards,
        state.shuffledStack,
        state.config.targetValue
      )
      return hint.length > 1 ? { ...state, hint } : state
    }

    case 'ai play requested': {
      const [cardIndex, ...tableIndixes] = getBestPlay(
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
      if (typeof state.selectedAiCard !== 'number') {
        throw new Error('Cannot execute play. No AI card selected.')
      }
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
  }
}

function range(start: number, amount: number): number[] {
  return Array.from(Array(amount), (_, i) => i + start)
}

function checkValidConfig(cfg: State['config']): void {
  if (
    cfg.tableCardsAmount + 2 * cfg.playerCardsAmount >
    cfg.availableCards.length
  ) {
    throw new Error('Insufficient cards in deck')
  }
  const invalidValues = cfg.availableCards.filter(
    (value) => value >= cfg.targetValue
  )
  if (invalidValues.length > 0) {
    throw new Error(
      `Some values in the deck (${invalidValues.join(
        ', '
      )}) are greater or equal than the target value (${cfg.targetValue})`
    )
  }
}

export function init({
  shuffledStack,
  isPlayerTurn,
  config,
}: Pick<State, 'shuffledStack' | 'isPlayerTurn' | 'config'>): State {
  checkValidConfig(config)
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
    userMessage: null,
    config,
  }
}
