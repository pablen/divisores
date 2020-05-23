import combinations from 'combinations'

import { defaultConfig } from './config'

export function getShuffledStack(
  availableCards = defaultConfig.availableCards
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
