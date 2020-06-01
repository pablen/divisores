import React, { useState, useEffect } from 'react'
import FireStoreParser from 'firestore-parser'
import qs from 'query-string'

import { roomsApiUrlPattern, defaultConfig } from './config'
import presets from './presets'
import Game from './Game'

function getRoomConfig(roomId) {
  return fetch(roomsApiUrlPattern.replace('{roomId}', roomId))
    .then((res) => res.json())
    .then((json) => FireStoreParser(json).fields.config)
    .then((roomConfig) => {
      console.log(
        `Fetched remote configuration for room "${roomId}"`,
        roomConfig
      )
      return roomConfig
    })
}

function getLocalConfig(params) {
  const baseConfig = presets[params.preset]
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
    ...baseConfig,
    targetValue,
    playerCardsAmount: isValidStack
      ? playerCardsAmount
      : baseConfig.playerCardsAmount,
    tableCardsAmount: isValidStack
      ? tableCardsAmount
      : baseConfig.tableCardsAmount,
    availableCards: isValidStack ? availableCards : baseConfig.availableCards,
    cardType: ['image', 'number'].includes(params.cardType)
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

const parsedQs = qs.parse(window.location.search, {
  parseBooleans: true,
  parseNumbers: true,
  arrayFormat: 'comma',
})

const isValidRoomId = typeof parsedQs.r === 'string'

// If valid roomId querystring param, we wait for remote config
const initialState = isValidRoomId ? null : getLocalConfig(parsedQs)

export default function ConfigProvider() {
  const [initialConfig, setInitialConfig] = useState(initialState)

  useEffect(() => {
    if (!isValidRoomId) return
    getRoomConfig(parsedQs.r)
      .then(setInitialConfig)
      .catch((e) => {
        console.warn(
          `Error fetching remote configuration for room "${parsedQs.r}":`,
          e.message
        )
        setInitialConfig(getLocalConfig(parsedQs))
      })
  }, [])

  return initialConfig ? (
    <Game
      initialConfig={initialConfig}
      showRules={window.localStorage.getItem('showRules') !== 'false'}
    />
  ) : (
    'Cargando la configuración de la sala...'
  )
}
