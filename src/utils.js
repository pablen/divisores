import combinations from 'combinations'
import qs from 'query-string'

import { defaultConfig } from './config'
import presets from './presets'

function getInitialConfig() {
  const parsedQs = qs.parse(window.location.search, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: 'comma',
  })

  const baseConfig = presets[parsedQs.preset]
    ? presets[parsedQs.preset].options
    : defaultConfig

  const playerCardsAmount =
    typeof parsedQs.playerCardsAmount === 'number' &&
    parsedQs.playerCardsAmount > 0
      ? parsedQs.playerCardsAmount
      : baseConfig.playerCardsAmount

  const tableCardsAmount =
    typeof parsedQs.tableCardsAmount === 'number' &&
    parsedQs.tableCardsAmount >= 0
      ? parsedQs.tableCardsAmount
      : baseConfig.tableCardsAmount

  const targetValue =
    typeof parsedQs.targetValue === 'number' && parsedQs.targetValue > 2
      ? parsedQs.targetValue
      : baseConfig.targetValue

  const availableCards = Array.isArray(parsedQs.availableCards)
    ? parsedQs.availableCards.filter(
        (v) => typeof v === 'number' && v > 0 && v < targetValue
      )
    : baseConfig.availableCards

  const isValidStack =
    availableCards.length >= tableCardsAmount + 2 * playerCardsAmount

  return {
    ...baseConfig,
    targetValue,
    playerCardsAmount: isValidStack
      ? playerCardsAmount
      : baseConfig.playerCardsAmount,
    tableCardsAmount: isValidStack
      ? tableCardsAmount
      : baseConfig.tableCardsAmount,
    availableCards: isValidStack ? availableCards : baseConfig.availableCards,
    cardType: ['image', 'number'].includes(parsedQs.cardType)
      ? parsedQs.cardType
      : baseConfig.cardType,
    pauseOnAiPlay:
      typeof parsedQs.pauseOnAiPlay === 'boolean'
        ? parsedQs.pauseOnAiPlay
        : baseConfig.pauseOnAiPlay,
  }
}

export const initialConfig = getInitialConfig()

export function getShuffledStack(
  availableCards = initialConfig.availableCards
) {
  return [...availableCards].sort(() => Math.random() * 2 - 1)
}

export function getRandomTurn() {
  return Math.random() >= 0.5
}

/**
 * Retorna un array de índices de cartas para realizar la mejor jugada posible.
 * - Si length === 1: no se pueden robar cartas y el índice corresponde a la carta a descartar
 * - Si length > 1, el primer elemento es el índice de la carta a jugar
 *   y el resto son los índices de las cartas de la mesa que forman parte de la jugada
 */
export function getBestPlay(playerCards, tableCards, targetValue) {
  const sortedCombinations = combinations(
    tableCards.map((value, index) => ({ index, value }))
  ).sort((a, b) => b.length - a.length)

  for (let i = 0; i < sortedCombinations.length; i++) {
    const requiredCardValue =
      targetValue -
      sortedCombinations[i].reduce((acc, { value }) => acc + value, 0)

    const requiredCardIndex = playerCards.indexOf(requiredCardValue)

    if (requiredCardIndex > -1) {
      const tableCardsIndexes = sortedCombinations[i].map(({ index }) => index)
      return [requiredCardIndex, ...tableCardsIndexes]
    }
  }

  return [playerCards.indexOf(Math.max(...playerCards))]
}
