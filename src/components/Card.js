import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import React from 'react'

import CardFront from './CardFront'
import CardBack from './CardBack'
import styles from './Card.module.css'

export default function Card({
  isReversed,
  isDisabled,
  isSelected,
  isHinted,
  onClick,
  value,
  type,
  id,
}) {
  const actualType = value > 10 ? 'number' : type || 'image'
  const className = [
    styles.container,
    styles[`type-${actualType}`],
    isHinted ? styles.isHinted : '',
  ].join(' ')

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
        }
      : { className, 'aria-selected': isSelected, layoutId: id },
    isReversed ? (
      <CardBack className={styles.back} />
    ) : (
      <CardFront className={styles.front} value={value} type={actualType} />
    )
  )
}

Card.propTypes = {
  isReversed: PropTypes.bool,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isHinted: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['number', 'image']),
  id: PropTypes.string.isRequired,
}
