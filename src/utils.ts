import PropTypes from 'prop-types'

/** The card index in shuffledStack. It serves the purpose of a card ID. */
export type CardIndex = number

export const configPropTypes = PropTypes.shape({
  playerCardsAmount: PropTypes.number.isRequired,
  availableCards: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  minDivisor: PropTypes.number.isRequired,
  maxDivisor: PropTypes.number.isRequired,
  cardType: PropTypes.oneOf<'image' | 'number'>(['image', 'number']).isRequired,
})
