import React, { useState, useEffect, useCallback } from 'react'
import FireStoreParser from 'firestore-parser'
import arrayShuffle from 'array-shuffle'
import { parse } from 'query-string'

import presets, { ConfigOptions, PresetName } from './presets'
import { roomsApiUrlPattern, defaultConfig } from './config'
import { getRandomTurn } from './utils'
import Game from './Game'

function getRoomConfig(roomId: string): Promise<ConfigOptions> {
  return fetch(roomsApiUrlPattern.replace('{roomId}', roomId))
    .then((res) => res.json())
    .then(
      (json) =>
        FireStoreParser<{ fields: { config: ConfigOptions } }>(json).fields
          .config
    )
    .then((roomConfig) => {
      console.log(
        `Fetched remote configuration for room "${roomId}"`,
        roomConfig
      )
      return roomConfig
    })
}

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

  const tableCardsAmount =
    typeof params.tableCardsAmount === 'number' && params.tableCardsAmount >= 0
      ? params.tableCardsAmount
      : baseConfig.tableCardsAmount

  const targetValue =
    typeof params.targetValue === 'number' && params.targetValue > 2
      ? params.targetValue
      : baseConfig.targetValue

  const availableCards = Array.isArray(params.availableCards)
    ? params.availableCards.filter(
        (v) => typeof v === 'number' && v > 0 && v < targetValue
      )
    : baseConfig.availableCards

  const isValidStack =
    availableCards.length >= tableCardsAmount + 2 * playerCardsAmount

  return {
    targetValue,
    playerCardsAmount: isValidStack
      ? playerCardsAmount
      : baseConfig.playerCardsAmount,
    tableCardsAmount: isValidStack
      ? tableCardsAmount
      : baseConfig.tableCardsAmount,
    availableCards: isValidStack ? availableCards : baseConfig.availableCards,
    cardType:
      params.cardType && ['image', 'number'].includes(params.cardType)
        ? params.cardType
        : baseConfig.cardType,
    pauseOnAiPlay:
      typeof params.pauseOnAiPlay === 'boolean'
        ? params.pauseOnAiPlay
        : baseConfig.pauseOnAiPlay,
    hintsDelay:
      typeof params.hintsDelay === 'number'
        ? params.hintsDelay
        : baseConfig.hintsDelay,
  }
}

const parsedQs = parse(window.location.search, {
  parseBooleans: true,
  parseNumbers: true,
  arrayFormat: 'comma',
})

const isValidRoomId = typeof parsedQs.r === 'string'

// If valid roomId querystring param, we wait for remote config
const initialState = isValidRoomId ? null : getLocalConfig(parsedQs)

const ConfigProvider: React.FC = () => {
  const [initialConfig, setInitialConfig] = useState(initialState)

  useEffect(() => {
    if (!isValidRoomId) return
    getRoomConfig(parsedQs.r as string)
      .then(setInitialConfig)
      .catch((e) => {
        console.warn(
          `Error fetching remote configuration for room "${parsedQs.r}":`,
          e.message
        )
        setInitialConfig(getLocalConfig(parsedQs))
      })
  }, [])

  const handleShuffle = useCallback(
    (arr: number[]) =>
      process.env.NODE_ENV === 'development' && parsedQs.noShuffle
        ? arr
        : arrayShuffle(arr),
    []
  )

  const initialIsPlayerTurn =
    process.env.NODE_ENV === 'development' &&
    typeof parsedQs.isPlayerTurn !== 'undefined'
      ? Boolean(parsedQs.isPlayerTurn)
      : getRandomTurn()

  return initialConfig ? (
    <Game
      initialIsPlayerTurn={initialIsPlayerTurn}
      initialConfig={initialConfig}
      showRules={window.localStorage.getItem('showRules') !== 'false'}
      shuffle={handleShuffle}
    />
  ) : (
    <span>Cargando la configuración de la sala...</span>
  )
}

export default ConfigProvider
