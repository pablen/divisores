import PropTypes from 'prop-types'
import React from 'react'

import styles from './Btn.module.css'

export default function Btn({
  className = '',
  children,
  small,
  type = 'button',
  text,
  ...other
}) {
  return (
    <button
      className={[
        styles.container,
        small ? styles.isSmall : '',
        text ? styles.isText : '',
        className,
      ].join(' ')}
      // eslint-disable-next-line react/button-has-type
      type={type}
      {...other}
    >
      {children}
    </button>
  )
}

Btn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  text: PropTypes.bool,
}
