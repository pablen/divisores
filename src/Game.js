import React, { useReducer, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion } from 'framer-motion'

import { init, reducer } from './store'
import RulesDialog from './components/RulesDialog'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import ScoreBoard from './components/ScoreBoard'
import * as utils from './utils'
import Card from './components/Card'

function Game({ initialConfig }) {
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
  const [isRulesVisible, setIsRulesVisible] = useState(true)

  const hasStackEnoughCards =
    state.stackCards.length >= 2 * state.config.playerCardsAmount

  const hasPlayerCards = state.playerCards.length > 0

  const hasAiCards = state.aiCards.length > 0

  const isGameFinished = !hasPlayerCards && !hasAiCards && !hasStackEnoughCards

  const playerPoints =
    state.playerSweeps + (state.playerStackLength > state.aiStackLength ? 1 : 0)

  const aiPoints =
    state.aiSweeps + (state.aiStackLength > state.playerStackLength ? 1 : 0)

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
            {state.aiCards.map((card, i) =>
              state.selectedAiCard === i ? (
                <Card
                  isSelected
                  value={card.value}
                  type={state.config.cardType}
                  key={`aiCard-${card.id}`}
                  id={card.id}
                />
              ) : (
                <motion.div
                  className="reverseCard"
                  layoutId={card.id}
                  key={`aiCard-${card.id}`}
                >
                  {card.value}
                </motion.div>
              )
            )}
          </div>
        </div>

        <div className="mainStack">
          {state.stackCards.map((card, i) => (
            <motion.div
              className="reverseCard"
              layoutId={card.id}
              key={`aiCard-${card.id}`}
            >
              {card.value}
            </motion.div>
          ))}
        </div>

        <div className="table">
          {state.tableCards.map((card, i) => (
            <Card
              isSelected={state.selectedTableCards.includes(i)}
              isDisabled={isGameFinished || !state.isPlayerTurn}
              onClick={() =>
                dispatch({ type: 'table card selected', payload: i })
              }
              value={card.value}
              type={state.config.cardType}
              key={`tableCard-${card.id}`}
              id={card.id}
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
                        state.aiCards[state.selectedAiCard].value
                      }`
                    : `La máquina juega ${[
                        state.aiCards[state.selectedAiCard].value,
                        ...state.selectedTableCards.map(
                          (i) => state.tableCards[i].value
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
            {state.playerCards.map((card, i) => (
              <Card
                isSelected={state.selectedPlayerCard === i}
                isDisabled={!state.isPlayerTurn}
                onClick={() =>
                  dispatch({ type: 'player card selected', payload: i })
                }
                value={card.value}
                type={state.config.cardType}
                key={`playerCard-${card.id}`}
                id={card.id}
              />
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
            playerStackLength={state.playerStackLength}
            aiStackLength={state.aiStackLength}
            playerSweeps={state.playerSweeps}
            aiSweeps={state.aiSweeps}
          />
        </div>
      </AnimateSharedLayout>

      {/* {<hr />
      <pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </div>
  )
}

Game.propTypes = {
  initialConfig: utils.configPropTypes.isRequired,
}

export default Game
