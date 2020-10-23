import arrayShuffle from 'array-shuffle'
import { parse } from 'query-string'
import React from 'react'

import presets, { ConfigOptions, PresetName } from './presets'
import { defaultConfig } from './config'
import Game from './Game'

interface QueryStringParams extends Partial<ConfigOptions> {
  preset?: PresetName
}

function getLocalConfig(params: QueryStringParams): ConfigOptions {
  const baseConfig =
    typeof params.preset === 'string' && presets[params.preset]
      ? presets[params.preset].options
      : defaultConfig

  const playerCardsAmount =
    typeof params.playerCardsAmount === 'number' && params.playerCardsAmount > 0
      ? params.playerCardsAmount
      : baseConfig.playerCardsAmount

  const minDivisor =
    typeof params.minDivisor === 'number' && params.minDivisor > 1
      ? params.minDivisor
      : baseConfig.minDivisor

  const maxDivisor =
    typeof params.maxDivisor === 'number' &&
    params.maxDivisor > 1 &&
    params.maxDivisor >= minDivisor
      ? params.maxDivisor
      : baseConfig.maxDivisor

  const availableCards = Array.isArray(params.availableCards)
    ? params.availableCards.filter((v) => typeof v === 'number' && v > 1)
    : baseConfig.availableCards

  const isValidStack = availableCards.length >= playerCardsAmount

  return {
    playerCardsAmount: isValidStack
      ? playerCardsAmount
      : baseConfig.playerCardsAmount,
    availableCards: isValidStack ? availableCards : baseConfig.availableCards,
    minDivisor,
    maxDivisor,
    cardType:
      params.cardType && ['image', 'number'].includes(params.cardType)
        ? params.cardType
        : baseConfig.cardType,
  }
}

const parsedQs = parse(window.location.search, {
  parseBooleans: true,
  parseNumbers: true,
  arrayFormat: 'comma',
})

function createDeck({
  playerCardsAmount,
  availableCards,
  minDivisor,
  maxDivisor,
}: Omit<ConfigOptions, 'cardType'>) {
  const shuffleFn =
    process.env.NODE_ENV === 'development' && parsedQs.noShuffle
      ? (v: number[]) => v
      : arrayShuffle
  const shuffledCards = shuffleFn(availableCards)
  let deck: ConfigOptions['availableCards'] = []

  for (
    let i = 0;
    i <
    Math.floor(shuffledCards.length / playerCardsAmount) * playerCardsAmount;
    i += playerCardsAmount
  ) {
    const playerCards = shuffledCards.slice(i, i + playerCardsAmount)
    const tableCards = playerCards.map(
      (card) =>
        card *
        (Math.floor(Math.random() * (maxDivisor + 1 - minDivisor)) + minDivisor)
    )
    deck = deck.concat(playerCards, shuffleFn(tableCards))
  }
  return deck
}

const ConfigProvider: React.FC = () => (
  <Game
    initialConfig={getLocalConfig(parsedQs)}
    showRules={window.localStorage.getItem('showRules') !== 'false'}
    shuffle={createDeck}
  />
)

export default ConfigProvider
