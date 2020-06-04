import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './Input.module.css'

export const Label: React.FC<LabelProps> = ({ children, ...other }) => (
  <label className={styles.label} {...other}>
    {children}
  </label>
)

const LabelPropTypes = {
  children: PropTypes.node.isRequired,
}

Label.propTypes = LabelPropTypes

type LabelProps = PropTypes.InferProps<typeof LabelPropTypes> &
  React.PropsWithoutRef<JSX.IntrinsicElements['label']>

const Input: React.FC<Props> = (props) => {
  const {
    labelProps = {},
    className,
    onChange,
    label,
    // eslint-disable-next-line react/prop-types
    type,
    rows,
    id,
    mt,
    mb,
    ...other
  } = props

  const handleChange: React.FormEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      // eslint-disable-next-line react/prop-types
      if (props.type === 'number') {
        props.onChange(
          isNaN(ev.currentTarget.valueAsNumber)
            ? undefined
            : ev.currentTarget.valueAsNumber
        )
      } else {
        props.onChange(ev.currentTarget.value)
      }
    },
    [props]
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

const InputPropTypes = {
  labelProps: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  // type: PropTypes.oneOf<'text' | 'number'>(['text', 'number']).isRequired,
  rows: PropTypes.number,
  id: PropTypes.string.isRequired,
  mt: PropTypes.string,
  mb: PropTypes.string,
}

Input.propTypes = InputPropTypes

type BaseProps = Omit<
  PropTypes.InferProps<typeof InputPropTypes> &
    React.PropsWithoutRef<JSX.IntrinsicElements['textarea']> &
    React.PropsWithoutRef<JSX.IntrinsicElements['input']>,
  'onChange'
>

interface TextProps extends BaseProps {
  type: 'text'
  onChange: (v: string) => void
}

interface NumberProps extends BaseProps {
  type: 'number'
  onChange: (v?: number) => void
}

type Props = TextProps | NumberProps

export default Input
