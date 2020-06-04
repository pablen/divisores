import React from 'react'

const CardPlaceholder: React.FC<Props> = (props) => (
  <svg
    preserveAspectRatio="xMinYMin"
    aria-hidden="true"
    viewBox="0 0 62 88"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="0" y="0" width="62" height="88" fill="transparent" />
  </svg>
)

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['svg']>

export default CardPlaceholder
