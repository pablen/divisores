import { render } from '@testing-library/react'
import React from 'react'

import presets from './presets'
import Game from './Game'

test('Shows Rules dialog on startup if enabled', async () => {
  const { getByText } = render(
    <Game showRules initialConfig={presets.del10.options} />
  )
  expect(getByText('Reglas del juego')).toBeInTheDocument()
})

test('Hides Rules dialog on startup if disabled', async () => {
  const { queryByText } = render(
    <Game showRules={false} initialConfig={presets.del10.options} />
  )
  expect(queryByText('Reglas del juego')).not.toBeInTheDocument()
})
