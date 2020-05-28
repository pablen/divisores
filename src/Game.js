import React, { useReducer, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { init, reducer } from './store'
import RulesDialog from './components/RulesDialog'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import ScoreBoard from './components/ScoreBoard'
import * as utils from './utils'
import Card from './components/Card'

function Game({ initialConfig, showRules }) {
  useEffect(() => {
    console.log(
      '%cInitial configuration',
      'font-weight: bold; color: blue;',
      initialConfig
    )
  }, [initialConfig])

  const [state, dispatch] = useReducer(
    reducer,
    {
      shuffledStack: utils.getShuffledStack(initialConfig.availableCards),
      isPlayerTurn: utils.getRandomTurn(),
      config: initialConfig,
    },
    init
  )
  const [isConfigVisible, setIsConfigVisible] = useState(false)
  const [isRulesVisible, setIsRulesVisible] = useState(showRules)

  const hasStackEnoughCards =
    state.stackCards.length >= 2 * state.config.playerCardsAmount

  const hasPlayerCards = state.playerCards.length > 0

  const hasAiCards = state.aiCards.length > 0

  const isGameFinished = !hasPlayerCards && !hasAiCards && !hasStackEnoughCards

  const playerPoints =
    state.playerSweeps +
    (state.playerStack.length > state.aiStack.length ? 1 : 0)

  const aiPoints =
    state.aiSweeps + (state.aiStack.length > state.playerStack.length ? 1 : 0)

  const canDiscard =
    !isGameFinished && state.isPlayerTurn && state.selectedPlayerCard !== null

  const canPlay =
    !isGameFinished &&
    state.isPlayerTurn &&
    state.selectedPlayerCard !== null &&
    state.selectedTableCards.length > 0

  useEffect(() => {
    if (state.selectedAiCard !== null && !state.config.pauseOnAiPlay) {
      setTimeout(() => dispatch({ type: 'ai played' }), 2 * config.aiPlayDelay)
    }
  }, [state.selectedAiCard, state.config.pauseOnAiPlay])

  useEffect(() => {
    if (isGameFinished) return
    if (
      (state.isPlayerTurn && !hasPlayerCards) ||
      (!state.isPlayerTurn && !hasAiCards)
    ) {
      setTimeout(
        () => dispatch({ type: 'new cards requested' }),
        config.aiPlayDelay
      )
      return
    }
    if (!state.isPlayerTurn && !isRulesVisible) {
      setTimeout(
        () => dispatch({ type: 'ai play requested' }),
        config.aiPlayDelay
      )
    }
  }, [
    state.config.aiPlayDelay,
    state.isPlayerTurn,
    isGameFinished,
    hasPlayerCards,
    isRulesVisible,
    hasAiCards,
  ])

  return (
    <div>
      <button
        className="configBtn"
        onClick={() => setIsConfigVisible((s) => !s)}
        title="Configuración"
        type="button"
      >
        <span className="visuallyHidden">Configuración</span>⚙️
      </button>

      {isRulesVisible && (
        <RulesDialog
          currentConfig={state.config}
          onClose={() => setIsRulesVisible(false)}
        />
      )}

      {isConfigVisible && (
        <ConfigForm
          currentConfig={state.config}
          onSubmit={(newConfig) =>
            dispatch({
              type: 'config updated',
              payload: {
                shuffledStack: utils.getShuffledStack(newConfig.availableCards),
                newConfig,
              },
            })
          }
          onClose={() => setIsConfigVisible(false)}
        />
      )}

      <AnimateSharedLayout>
        <div className="aiContainer">
          <div className="cardsStack">
            {state.aiCards.map((card) =>
              state.selectedAiCard === card ? (
                <Card
                  isSelected
                  value={state.shuffledStack[card]}
                  type={state.config.cardType}
                  key={`card-${card}`}
                  id={`card-${card}`}
                />
              ) : (
                <motion.div
                  className="reverseCard"
                  layoutId={`card-${card}`}
                  key={`card-${card}`}
                >
                  {state.shuffledStack[card]}
                </motion.div>
              )
            )}
          </div>
          <div className="mainStack" style={{ float: 'right' }}>
            {state.aiStack.map((card) => (
              <motion.div
                className="reverseCard"
                layoutId={`card-${card}`}
                key={`card-${card}`}
              >
                {state.shuffledStack[card]}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mainStack">
          {state.stackCards.map((card) => (
            <motion.div
              className="reverseCard"
              layoutId={`card-${card}`}
              key={`card-${card}`}
            >
              {state.shuffledStack[card]}
            </motion.div>
          ))}
        </div>

        <div className="table">
          {state.tableCards.map((card) => (
            <Card
              isSelected={state.selectedTableCards.includes(card)}
              isDisabled={isGameFinished || !state.isPlayerTurn}
              onClick={() =>
                dispatch({ type: 'table card selected', payload: card })
              }
              value={state.shuffledStack[card]}
              type={state.config.cardType}
              key={`card-${card}`}
              id={`card-${card}`}
            />
          ))}
        </div>

        <div className="playerContainer">
          <div className="message">
            {isGameFinished
              ? playerPoints > aiPoints
                ? 'Ganaste 😎'
                : playerPoints < aiPoints
                ? 'Perdiste 😭'
                : 'Empate 😐'
              : state.message ||
                (state.isPlayerTurn
                  ? 'Tu Turno'
                  : state.selectedAiCard !== null
                  ? state.selectedTableCards.length === 0
                    ? `La máquina se descarta un ${
                        state.shuffledStack[state.selectedAiCard]
                      }`
                    : `La máquina juega ${[
                        state.shuffledStack[state.selectedAiCard],
                        ...state.selectedTableCards.map(
                          (i) => state.shuffledStack[i]
                        ),
                      ].join(' + ')} = ${state.config.targetValue}`
                  : 'Esperando a que juege la máquina...')}

            {state.selectedAiCard !== null && state.config.pauseOnAiPlay && (
              <button
                onClick={() => dispatch({ type: 'ai play accepted' })}
                type="button"
              >
                OK
              </button>
            )}
          </div>

          <div className="cardsStack">
            {state.playerCards.map((card) => (
              <Card
                isSelected={state.selectedPlayerCard === card}
                isDisabled={!state.isPlayerTurn}
                onClick={() =>
                  dispatch({ type: 'player card selected', payload: card })
                }
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={`card-${card}`}
              />
            ))}
          </div>
          <div className="mainStack" style={{ float: 'right' }}>
            {state.playerStack.map((card) => (
              <motion.div
                className="reverseCard"
                layoutId={`card-${card}`}
                key={`card-${card}`}
              >
                {state.shuffledStack[card]}
              </motion.div>
            ))}
          </div>

          <div className="controls">
            {isGameFinished ? (
              <button
                className="large"
                onClick={() =>
                  dispatch({
                    type: 'reset',
                    payload: {
                      shuffledStack: utils.getShuffledStack(
                        state.config.availableCards
                      ),
                      isPlayerTurn: utils.getRandomTurn(),
                    },
                  })
                }
                type="button"
              >
                Jugar De Nuevo
              </button>
            ) : (
              <>
                <button
                  disabled={!canPlay}
                  onClick={() => dispatch({ type: 'play attempted' })}
                  type="button"
                >
                  Jugar
                </button>
                <button
                  disabled={!canDiscard}
                  onClick={() => dispatch({ type: 'player card discarded' })}
                  type="button"
                >
                  Descartar
                </button>
              </>
            )}
          </div>

          <ScoreBoard
            playerStackLength={state.playerStack.length}
            aiStackLength={state.aiStack.length}
            playerSweeps={state.playerSweeps}
            aiSweeps={state.aiSweeps}
          />
        </div>
      </AnimateSharedLayout>
    </div>
  )
}

Game.propTypes = {
  initialConfig: utils.configPropTypes.isRequired,
  showRules: PropTypes.bool.isRequired,
}

export default Game
