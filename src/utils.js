import * as defaults from './defaults'

export function getShuffledStack(availableCards = defaults.availableCards) {
  return [...availableCards].sort(() => Math.random() * 2 - 1)
}

/**
 * Retorna un array de índices de cartas para realizar la mejor jugada posible.
 * - Si length === 1: no se pueden robar cartas y el índice corresponde a la carta a descartar
 * - Si length > 1, el primer elemento es el índice de la carta a jugar
 *   y el resto son los índices de las cartas de la mesa que forman parte de la jugada
 */
export function getBestPlay(playerCards, tableCards, targetValue) {
  const sum = tableCards.reduce((acc, curr) => acc + curr, 0)
  const cardIndex = playerCards.indexOf(targetValue - sum)
  return cardIndex > -1
    ? [cardIndex, ...tableCards.keys()]
    : [Math.floor(Math.random() * playerCards.length)]
}
