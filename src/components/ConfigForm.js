import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

export default function ConfigForm({ onClose, onSubmit, currentConfig }) {
  const [message, setMessage] = useState(null)

  const [playerCardsAmount, setPlayerCardsAmount] = useState(
    currentConfig.playerCardsAmount
  )
  const [tableCardsAmount, setTableCardsAmount] = useState(
    currentConfig.tableCardsAmount
  )
  const [availableCards, setAvailableCards] = useState(
    currentConfig.availableCards.join(', ')
  )
  const [targetValue, setTargetValue] = useState(currentConfig.targetValue)

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const parsedAvailableCards = availableCards
        .split(',')
        .map((v) => parseInt(v, 10))
        .filter((v) => v && v >= 0)
      if (
        tableCardsAmount + 2 * playerCardsAmount >
        parsedAvailableCards.length
      ) {
        setMessage('Se necesitan más cartas en el mazo')
        return
      }
      setMessage(null)
      onClose()
      onSubmit({
        playerCardsAmount,
        tableCardsAmount,
        availableCards: parsedAvailableCards,
        targetValue,
      })
    },
    [
      playerCardsAmount,
      tableCardsAmount,
      availableCards,
      targetValue,
      onSubmit,
      onClose,
    ]
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="configContainer">
        <h2>Configuración</h2>
        <div className="fieldContainer">
          <label htmlFor="targetValue">Escoba del:</label>
          <input
            onChange={(e) => setTargetValue(e.target.valueAsNumber)}
            value={targetValue}
            type="number"
            min="2"
            id="targetValue"
          />
        </div>

        <div className="fieldContainer">
          <label htmlFor="playerCardsAmount">
            Cantidad de cartas por jugador:
          </label>
          <input
            onChange={(e) => setPlayerCardsAmount(e.target.valueAsNumber)}
            value={playerCardsAmount}
            type="number"
            min="1"
            id="playerCardsAmount"
          />
        </div>

        <div className="fieldContainer">
          <label htmlFor="tableCardsAmount">
            Cantidad de cartas en la mesa:
          </label>
          <input
            onChange={(e) => setTableCardsAmount(e.target.valueAsNumber)}
            value={tableCardsAmount}
            type="number"
            min="0"
            id="tableCardsAmount"
          />
        </div>

        <div className="fieldContainer">
          <label htmlFor="availableCards">Cartas del mazo:</label>
          <textarea
            id="availableCards"
            onChange={(e) => setAvailableCards(e.target.value)}
            value={availableCards}
          />
        </div>

        {message && <p>{message}</p>}

        <div className="formControls">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}

ConfigForm.propTypes = {
  currentConfig: PropTypes.shape({
    playerCardsAmount: PropTypes.number.isRequired,
    tableCardsAmount: PropTypes.number.isRequired,
    availableCards: PropTypes.arrayOf(PropTypes.number).isRequired,
    targetValue: PropTypes.number.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
