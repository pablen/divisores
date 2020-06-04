import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './Checkbox.module.css'

const Checkbox: React.FC<Props> = ({
  labelProps,
  onChange,
  children,
  mt,
  mb,
  ...other
}) => {
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
      {...(mt || mb ? inlineStyles : {})}
      {...(labelProps || {})}
      className={[
        styles.container,
        labelProps && labelProps.className ? labelProps.className : '',
      ].join(' ')}
    >
      <input
        className={styles.input}
        onChange={handleChange}
        type="checkbox"
        {...other}
      />
      {children}
    </label>
  )
}

const CheckboxPropTypes = {
  labelProps: PropTypes.shape({
    className: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  mt: PropTypes.string,
  mb: PropTypes.string,
}

Checkbox.propTypes = CheckboxPropTypes

type Props = Omit<
  PropTypes.InferProps<typeof CheckboxPropTypes> &
    React.PropsWithoutRef<JSX.IntrinsicElements['input']>,
  'onChange'
> & {
  onChange: (checked: boolean) => void
}

export default Checkbox
