import React, { useReducer, useEffect, useState } from 'react'
import { AnimateSharedLayout } from 'framer-motion'
import PropTypes from 'prop-types'

import { init, reducer } from './store'
import CardPlaceholder from './components/CardPlaceholder'
import RulesDialog from './components/RulesDialog'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import ScoreBoard from './components/ScoreBoard'
import Btn from './components/Btn'
import * as utils from './utils'
import styles from './Game.module.css'
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

  const message = isGameFinished
    ? ''
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
              ...state.selectedTableCards.map((i) => state.shuffledStack[i]),
            ].join(' + ')} = ${state.config.targetValue}`
        : 'Esperando a que juege la máquina...')

  return (
    <div className={styles.container}>
      <button
        className={styles.configBtn}
        onClick={() => setIsConfigVisible((s) => !s)}
        title="Configuración"
        type="button"
      >
        <span className="visuallyHidden">Configuración</span>⚙️
      </button>

      <AnimateSharedLayout>
        <section className={styles.aiSection}>
          <div className={styles.aiCards}>
            {state.aiCards.map((card) => (
              <Card
                isReversed={state.selectedAiCard !== card}
                isSelected={state.selectedAiCard === card}
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={`card-${card}`}
              />
            ))}
          </div>
          <div className={styles.aiDeck}>
            {state.aiStack.map((card) => (
              <Card
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={`card-${card}`}
              />
            ))}
          </div>
        </section>

        <section
          className={[
            styles.tableSection,
            isGameFinished ? styles.gameFinished : '',
          ].join(' ')}
        >
          <div className={styles.tableSide}>
            <div className={styles.deckContainer}>
              <CardPlaceholder className={styles.placeholder} />
              {state.stackCards.map((card) => (
                <Card
                  isReversed
                  value={state.shuffledStack[card]}
                  type={state.config.cardType}
                  key={`card-${card}`}
                  id={`card-${card}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.tableCards}>
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
          {isGameFinished && (
            <div className={styles.gameSummary}>
              <div className={styles.gameResult}>
                {playerPoints > aiPoints
                  ? '🏆 ¡Ganaste! 🏆'
                  : playerPoints < aiPoints
                  ? 'Perdiste'
                  : 'Empate'}
              </div>
              <ScoreBoard
                playerStackLength={state.playerStack.length}
                aiStackLength={state.aiStack.length}
                playerSweeps={state.playerSweeps}
                playerPoints={playerPoints}
                aiSweeps={state.aiSweeps}
                aiPoints={aiPoints}
              />
              <Btn
                autoFocus
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
              </Btn>
            </div>
          )}
        </section>

        <section className={styles.messageSection}>
          {message}
          {state.selectedAiCard !== null && state.config.pauseOnAiPlay && (
            <Btn
              className={styles.okBtn}
              autoFocus
              onClick={() => dispatch({ type: 'ai play accepted' })}
            >
              OK
            </Btn>
          )}
        </section>

        <section className={styles.playerSection}>
          <div className={styles.playerCards}>
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
          <div className={styles.playerDeck}>
            {state.playerStack.map((card) => (
              <Card
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={`card-${card}`}
              />
            ))}
          </div>
        </section>

        <section className={styles.controlsSection}>
          {!isGameFinished && (canPlay || canDiscard) && (
            <Btn
              className={styles.controlBtn}
              disabled={!canPlay && !canDiscard}
              onClick={() =>
                dispatch({
                  type: canPlay ? 'play attempted' : 'player card discarded',
                })
              }
              type="button"
            >
              {canPlay ? 'Jugar' : 'Descartar'}
            </Btn>
          )}
        </section>
      </AnimateSharedLayout>

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
    </div>
  )
}

Game.propTypes = {
  initialConfig: utils.configPropTypes.isRequired,
  showRules: PropTypes.bool.isRequired,
}

export default Game
