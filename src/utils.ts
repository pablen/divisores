import combinations from 'combinations'
import PropTypes from 'prop-types'

/** The card index in shuffledStack. It serves the purpose of a card ID. */
export type CardIndex = number

export const configPropTypes = PropTypes.shape({
  playerCardsAmount: PropTypes.number.isRequired,
  tableCardsAmount: PropTypes.number.isRequired,
  availableCards: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  pauseOnAiPlay: PropTypes.bool.isRequired,
  targetValue: PropTypes.number.isRequired,
  hintsDelay: PropTypes.number.isRequired,
  cardType: PropTypes.oneOf<'image' | 'number'>(['image', 'number']).isRequired,
})

export function getRandomTurn(): boolean {
  return Math.random() >= 0.5
}

/**
 * Retorna un array de índices de cartas para realizar la mejor jugada posible.
 * - Si length === 1: no se pueden robar cartas y el índice corresponde a la carta a descartar
 * - Si length > 1, el primer elemento es el índice de la carta a jugar
 *   y el resto son los índices de las cartas de la mesa que forman parte de la jugada
 */
export function getBestPlay(
  playerCards: CardIndex[],
  tableCards: CardIndex[],
  stack: CardIndex[],
  targetValue: number
): CardIndex[] {
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

    if (requiredCard !== undefined) {
      return [requiredCard, ...sortedCombinations[i]]
    }
  }
  // If there are no possible combinations, discard the card with greater value
  return [
    playerCards.find(
      (stackIndex) =>
        stack[stackIndex] === Math.max(...playerCards.map((ci) => stack[ci]))
    ) as number,
  ]
}
