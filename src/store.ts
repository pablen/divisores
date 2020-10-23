import { isDebugEnabled } from './config'
import { ConfigOptions } from './presets'
import { CardIndex } from './utils'

export type State = {
  config: ConfigOptions

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
   * The cards picked up by player plays.
   * Referenced as indices of the shuffledStack
   */
  playerStack: CardIndex[]

  /**
   * Table card selected for the current play.
   * Referenced as an index of the shuffledStack
   */
  selectedTableCard: CardIndex | null

  /**
   * Player card selected for the current play.
   * Referenced a an index of the shuffledStack
   */
  selectedPlayerCard: CardIndex | null

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
  | { type: 'player card selected'; payload: CardIndex }
  | { type: 'table card selected'; payload: CardIndex }
  | { type: 'new cards requested' }
  | { type: 'discard remaining cards' }
  | { type: 'play attempted' }

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
        config: state.config,
      })

    case 'config updated':
      return init({
        shuffledStack: action.payload.shuffledStack,
        config: { ...state.config, ...action.payload.newConfig },
      })

    case 'player card selected':
      if (!state.playerCards.includes(action.payload)) {
        throw new Error(
          `Player does not have a card with index ${action.payload}`
        )
      }
      return { ...state, selectedPlayerCard: action.payload, userMessage: null }

    case 'table card selected':
      if (!state.tableCards.includes(action.payload)) {
        throw new Error(
          `Table does not have a card with index ${action.payload}`
        )
      }
      return {
        ...state,
        userMessage: null,
        selectedTableCard: action.payload,
      }

    case 'play attempted': {
      if (
        typeof state.selectedPlayerCard !== 'number' ||
        typeof state.selectedTableCard !== 'number'
      ) {
        throw new Error('Cannot execute play. No cards pair selected.')
      }

      const playerCard = state.shuffledStack[state.selectedPlayerCard]
      const tableCard = state.shuffledStack[state.selectedTableCard]
      const isValidPlay =
        Math.max(playerCard, tableCard) % Math.min(playerCard, tableCard) === 0

      if (!isValidPlay) {
        return {
          ...state,
          userMessage: 'Las cartas elegidas no son divisores!',
        }
      }

      const tableCards = state.tableCards.filter(
        (v) => v !== state.selectedTableCard
      )

      return {
        ...state,
        selectedTableCard: null,
        selectedPlayerCard: null,
        tableCards,
        playerCards: state.playerCards.filter(
          (v) => v !== state.selectedPlayerCard
        ),
        playerStack: [
          ...state.playerStack,
          state.selectedTableCard,
          state.selectedPlayerCard,
        ],
        userMessage: null,
      }
    }

    case 'discard remaining cards':
    case 'new cards requested':
      return {
        ...state,
        playerCards: state.stackCards.slice(0, state.config.playerCardsAmount),
        stackCards: state.stackCards.slice(2 * state.config.playerCardsAmount),
        tableCards: state.stackCards.slice(
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
  const invalidValues = cfg.availableCards.filter((value) => value <= 1)
  if (invalidValues.length > 0) {
    throw new Error(
      `Some values in the deck (${invalidValues.join(
        ', '
      )}) are lesser or equal than 1.`
    )
  }
}

export function init({
  shuffledStack,
  config,
}: Pick<State, 'shuffledStack' | 'config'>): State {
  checkValidConfig(config)
  return {
    playerCards: range(0, config.playerCardsAmount),
    tableCards: range(config.playerCardsAmount, config.playerCardsAmount),

    stackCards: range(
      2 * config.playerCardsAmount,
      Math.floor(
        (shuffledStack.length - 2 * config.playerCardsAmount) /
          (2 * config.playerCardsAmount)
      ) *
        2 *
        config.playerCardsAmount
    ),

    shuffledStack,

    selectedTableCard: null,
    selectedPlayerCard: null,

    playerStack: [],

    userMessage: null,
    config,
  }
}
