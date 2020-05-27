import { render } from '@testing-library/react'
import React from 'react'

import Game from './Game'

test('renders score table headers', () => {
  const { getByText } = render(<Game />)
  expect(getByText(/Escobas/i)).toBeInTheDocument()
  expect(getByText(/Cartas Acumuladas/i)).toBeInTheDocument()
})
