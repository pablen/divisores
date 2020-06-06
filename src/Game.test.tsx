import { render } from '@testing-library/react'
import React from 'react'

import presets from './presets'
import Game from './Game'

function fakeShuffle<T>(v: T): T {
  return v
}

test('Shows Rules dialog on startup if enabled', async () => {
  const { getByText } = render(
    <Game
      initialIsPlayerTurn
      initialConfig={presets.del10.options}
      showRules
      shuffle={fakeShuffle}
    />
  )
  expect(getByText('Reglas del juego')).toBeInTheDocument()
})

test('Hides Rules dialog on startup if disabled', async () => {
  const { queryByText } = render(
    <Game
      initialIsPlayerTurn
      initialConfig={presets.del10.options}
      showRules={false}
      shuffle={fakeShuffle}
    />
  )
  expect(queryByText('Reglas del juego')).not.toBeInTheDocument()
})
