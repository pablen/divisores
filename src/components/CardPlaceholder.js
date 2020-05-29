import React from 'react'

export default function CardPlaceholder({ ...props }) {
  return (
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
}
