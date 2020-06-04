import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { CardIndex } from '../utils'
import CardFront from './CardFront'
import CardBack from './CardBack'
import styles from './Card.module.css'

const Card: React.FC<Props> = ({
  isReversed,
  isDisabled,
  isSelected,
  isHinted,
  onClick,
  value,
  type,
  id,
}) => {
  const actualType = value > 10 ? 'number' : type || 'image'
  const className = [
    styles.container,
    styles[`type-${actualType}`],
    isHinted ? styles.isHinted : '',
  ].join(' ')

  const image = isReversed ? (
    <CardBack className={styles.back} />
  ) : (
    <CardFront className={styles.front} value={value} type={actualType} />
  )

  const handleClick = useCallback(() => {
    onClick && onClick(id)
  }, [onClick, id])

  return onClick ? (
    <motion.button
      aria-pressed={!!isSelected}
      className={className}
      disabled={!!isDisabled}
      layoutId={`card-${id}`}
      onClick={handleClick}
      type="button"
    >
      {image}
    </motion.button>
  ) : (
    <motion.div
      aria-pressed={!!isSelected}
      className={className}
      layoutId={`card-${id}`}
    >
      {image}
    </motion.div>
  )
}

const CardPropTypes = {
  isReversed: PropTypes.bool,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isHinted: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf<'number' | 'image'>(['number', 'image']),
  id: PropTypes.number.isRequired,
}

Card.propTypes = CardPropTypes

type Props = Omit<PropTypes.InferProps<typeof CardPropTypes>, 'onClick'> & {
  onClick?: (id: CardIndex) => void
}

export default Card
