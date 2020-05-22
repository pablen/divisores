import PropTypes from 'prop-types'
import React from 'react'

import Apple from './Apple'

export default function Card({ isDisabled, isSelected, onClick, value, type }) {
  const actualType = value > 10 ? 'number' : type || 'image'

  return (
    <button
      className={`card ${isSelected ? 'isSelected' : ''} ${
        type === 'image' && value > 6 ? 'isDense' : ''
      } cardType-${actualType}`}
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      <span className="cardNumber">{value}</span>
      {actualType === 'image' &&
        [...new Array(value).keys()].map((v, i) => <Apple key={i} />)}
    </button>
  )
}

Card.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['number', 'image']),
}
