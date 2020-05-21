import React, { useReducer, useEffect } from 'react'

import { init, reducer } from './store'
import * as config from './config'
import * as utils from './utils'
import Card from './components/Card'

function App() {
  const [state, dispatch] = useReducer(reducer, utils.getShuffledStack(), init)

  const hasStackEnoughCards =
    state.stackCards.length >= 2 * config.playerCardsAmount

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
  }, [state.isPlayerTurn, isGameFinished, hasAiCards, hasPlayerCards])

  return (
    <div>
      <p>Sumá {config.targetValue}</p>

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
            isDisabled={!state.isPlayerTurn}
            onClick={() =>
              dispatch({ type: 'table card selected', payload: i })
            }
            value={card}
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
              key={`playerCard-${i}-${card}`}
            />
          ))}
        </div>
        <div className="controls">
          {isGameFinished ? (
            <button
              className="large"
              onClick={() =>
                dispatch({ type: 'reset', payload: utils.getShuffledStack() })
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

        <table>
          <thead>
            <tr>
              <th />
              <th>Escobas</th>
              <th>Cartas Acumuladas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vos</td>
              <td className="center">{state.playerSweeps}</td>
              <td className="center">{state.playerStackLength}</td>
            </tr>
            <tr>
              <td>
                <span className="visuallyHidden">Máquina</span>🤖
              </td>
              <td className="center">{state.aiSweeps}</td>
              <td className="center">{state.aiStackLength}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* {<hr />
      <pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </div>
  )
}

export default App
