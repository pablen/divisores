import PropTypes from 'prop-types'
import React from 'react'

import styles from './Btn.module.css'

const Btn: React.FC<Props> = ({
  className = '',
  children,
  small,
  type = 'button',
  text,
  ...other
}) => (
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

const BtnPropTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  small: PropTypes.bool,
  type: PropTypes.oneOf<'button' | 'submit' | 'reset'>([
    'button',
    'submit',
    'reset',
  ]),
  text: PropTypes.bool,
}

Btn.propTypes = BtnPropTypes

type Props = PropTypes.InferProps<typeof BtnPropTypes> &
  React.PropsWithoutRef<JSX.IntrinsicElements['button']>

export default Btn
