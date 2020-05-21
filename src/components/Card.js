import PropTypes from 'prop-types'
import React from 'react'

export default function Card({ value, onClick, isDisabled, isSelected }) {
  return (
    <button
      className={`card ${isSelected ? 'isSelected' : ''}`}
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      {value}
    </button>
  )
}

Card.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}
