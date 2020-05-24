import React, { useReducer, useEffect, useState } from 'react'

import { init, reducer } from './store'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import ScoreBoard from './components/ScoreBoard'
import * as utils from './utils'
import Card from './components/Card'

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    {
      shuffledStack: utils.getShuffledStack(),
      isPlayerTurn: utils.getRandomTurn(),
    },
    init
  )
  const [isConfigVisible, setIsConfigVisible] = useState(false)

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
    if (isGameFinished) return
    if (
      (state.isPlayerTurn && !hasPlayerCards) ||
      (!state.isPlayerTurn && !hasAiCards)
    ) {
      dispatch({ type: 'cards requested' })
      return
    }
    if (state.isPlayerTurn) return
    setTimeout(() => dispatch({ type: 'ai played' }), config.aiPlayDelay)
  }, [
    state.config.aiPlayDelay,
    state.isPlayerTurn,
    isGameFinished,
    hasPlayerCards,
    hasAiCards,
  ])

  return (
    <div>
      <p>Sumá {state.config.targetValue}</p>
      <button
        className="configBtn"
        onClick={() => setIsConfigVisible((s) => !s)}
        title="Configuración"
        type="button"
      >
        <span className="visuallyHidden">Configuración</span>⚙️
      </button>

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

      <div className="aiContainer">
        <div className="cardsStack">
          {state.aiCards.map((card, i) => (
            <div className="reverseCard" key={`aiCard-${i}-${card}`}>
              {card}
            </div>
          ))}
        </div>
      </div>

      <div className="table">
        {state.tableCards.map((card, i) => (
          <Card
            isSelected={state.selectedTableCards.includes(i)}
            isDisabled={isGameFinished || !state.isPlayerTurn}
            onClick={() =>
              dispatch({ type: 'table card selected', payload: i })
            }
            value={card}
            type={state.config.cardType}
            key={`tableCard-${i}-${card}`}
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
                : 'Esperando a que juege la máquina...')}
        </div>

        <div className="cardsStack">
          {state.playerCards.map((card, i) => (
            <Card
              isSelected={state.selectedPlayerCard === i}
              isDisabled={!state.isPlayerTurn}
              onClick={() =>
                dispatch({ type: 'player card selected', payload: i })
              }
              value={card}
              type={state.config.cardType}
              key={`playerCard-${i}-${card}`}
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

      {/* {<hr />
      <pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </div>
  )
}

export default App
