import combinations from 'combinations'
import PropTypes from 'prop-types'

export const configPropTypes = PropTypes.shape({
  playerCardsAmount: PropTypes.number.isRequired,
  tableCardsAmount: PropTypes.number.isRequired,
  availableCards: PropTypes.arrayOf(PropTypes.number).isRequired,
  pauseOnAiPlay: PropTypes.bool.isRequired,
  targetValue: PropTypes.number.isRequired,
  cardType: PropTypes.oneOf(['image', 'number']).isRequired,
})

export function getShuffledStack(availableCards) {
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
export function getBestPlay(playerCards, tableCards, stack, targetValue) {
  const sortedCombinations = combinations(tableCards).sort(
    (a, b) => b.length - a.length
  )

  for (let i = 0; i < sortedCombinations.length; i++) {
    const requiredCardValue =
      targetValue -
      sortedCombinations[i].reduce((acc, index) => acc + stack[index], 0)

    const requiredCard = playerCards.find(
      (stackIndex) => stack[stackIndex] === requiredCardValue
    )

    if (requiredCard) return [requiredCard, ...sortedCombinations[i]]
  }
  return [
    playerCards.find(
      (stackIndex) =>
        stack[stackIndex] === Math.max(...playerCards.map((ci) => stack[ci]))
    ),
  ]
}
