import PropTypes from 'prop-types'
import React from 'react'

import Figures from './Figures'
import styles from './Card.module.css'

export default function Card({ isDisabled, isSelected, onClick, value, type }) {
  const actualType = value > 10 ? 'number' : type || 'image'
  const className = [styles.container, styles[`type-${actualType}`]].join(' ')

  return React.createElement(
    onClick ? 'button' : 'div',
    onClick
      ? {
          'aria-selected': isSelected,
          className,
          disabled: isDisabled,
          onClick,
          type: 'button',
        }
      : { className, 'aria-selected': isSelected },
    <span className={styles.number}>{value}</span>,
    actualType === 'image' && <Figures value={value} />
  )
}

Card.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['number', 'image']),
}
