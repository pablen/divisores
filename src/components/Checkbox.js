import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import styles from './Checkbox.module.css'

export default function Checkbox({
  labelProps = {},
  onChange,
  children,
  mt,
  mb,
  ...other
}) {
  const handleChange = useCallback((e) => onChange(e.target.checked), [
    onChange,
  ])

  const inlineStyles = {
    style: {
      ...(mb ? { marginBottom: mb } : {}),
      ...(mt ? { marginTop: mt } : {}),
    },
  }

  return (
    <label
      className={[styles.container, labelProps.className || ''].join(' ')}
      {...(mt || mb ? inlineStyles : {})}
      {...labelProps}
    >
      <input type="checkbox" onChange={handleChange} {...other} />
      {children}
    </label>
  )
}

Checkbox.propTypes = {
  labelProps: PropTypes.object,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  mt: PropTypes.string,
  mb: PropTypes.string,
}
