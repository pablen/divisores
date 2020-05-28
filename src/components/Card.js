import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import React from 'react'

import Figures from './Figures'
import styles from './Card.module.css'

export default function Card({
  isDisabled,
  isSelected,
  onClick,
  value,
  type,
  id,
}) {
  const actualType = value > 10 ? 'number' : type || 'image'
  const className = [styles.container, styles[`type-${actualType}`]].join(' ')

  return React.createElement(
    onClick ? motion.button : motion.div,
    onClick
      ? {
          'aria-selected': isSelected,
          className,
          disabled: isDisabled,
          layoutId: id,
          onClick,
          type: 'button',
          id,
        }
      : { className, 'aria-selected': isSelected, id, layoutId: id },
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
  id: PropTypes.string.isRequired,
}
