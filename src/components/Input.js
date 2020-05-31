import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './Input.module.css'

export function Label({ children, ...other }) {
  return (
    <label className={styles.label} {...other}>
      {children}
    </label>
  )
}

Label.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function Input({
  labelProps = {},
  className,
  onChange,
  label,
  type = 'text',
  rows,
  id,
  mt,
  mb,
  ...other
}) {
  const handleChange = useCallback(
    (e) => {
      onChange(
        type === 'number'
          ? isNaN(e.target.valueAsNumber)
            ? ''
            : e.target.valueAsNumber
          : e.target.value
      )
    },
    [onChange, type]
  )

  const inlineStyles = {
    style: {
      ...(mb ? { marginBottom: mb } : {}),
      ...(mt ? { marginTop: mt } : {}),
    },
  }

  return (
    <div
      className={[styles.container, className || ''].join(' ')}
      {...(mt || mb ? inlineStyles : {})}
    >
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>
      {React.createElement(typeof rows === 'number' ? 'textarea' : 'input', {
        className: [styles.input, styles[`type-${type}`]].join(' '),
        onChange: handleChange,
        name: id,
        type,
        rows,
        id,
        ...other,
      })}
    </div>
  )
}

Input.propTypes = {
  labelProps: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number']).isRequired,
  rows: PropTypes.number,
  id: PropTypes.string.isRequired,
  mt: PropTypes.string,
  mb: PropTypes.string,
}
