import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'

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

  const [cardType, setCardType] = useState(currentConfig.cardType)

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
      if (parsedAvailableCards.some((v) => v >= targetValue)) {
        setMessage(
          'El mazo no debe contener cartas de valor mayor o igual al de la Escoba'
        )
        return
      }
      setMessage(null)
      onClose()
      onSubmit({
        playerCardsAmount,
        tableCardsAmount,
        availableCards: parsedAvailableCards,
        targetValue,
        cardType,
      })
    },
    [
      playerCardsAmount,
      tableCardsAmount,
      availableCards,
      targetValue,
      onSubmit,
      cardType,
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
            onChange={(e) =>
              setTargetValue(
                isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber
              )
            }
            required
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
            onChange={(e) =>
              setPlayerCardsAmount(
                isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber
              )
            }
            required
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
            onChange={(e) =>
              setTableCardsAmount(
                isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber
              )
            }
            required
            value={tableCardsAmount}
            type="number"
            min="0"
            id="tableCardsAmount"
          />
        </div>

        <div className="fieldContainer">
          <div className="label">Tipo de carta:</div>
          <div className="cardTypesContainer">
            <label htmlFor="cardType-image">
              <input
                className="visuallyHidden"
                onChange={() => setCardType('image')}
                checked={cardType === 'image'}
                value="image"
                name="cardType"
                type="radio"
                id="cardType-image"
              />
              <Card
                isSelected={cardType === 'image'}
                onClick={() => setCardType('image')}
                value={5}
                type="image"
              />
              <span className="visuallyHidden">Dibujos</span>
            </label>
            <label htmlFor="cardType-number">
              <input
                className="visuallyHidden"
                onChange={(e) => setCardType(e.target.value)}
                checked={cardType === 'number'}
                value="number"
                name="cardType"
                type="radio"
                id="cardType-number"
              />
              <Card
                isSelected={cardType === 'number'}
                onClick={() => setCardType('number')}
                value={5}
                type="number"
              />
              <span className="visuallyHidden">Número</span>
            </label>
          </div>
        </div>

        <div className="fieldContainer">
          <label htmlFor="availableCards">Cartas del mazo:</label>
          <textarea
            onChange={(e) => setAvailableCards(e.target.value)}
            required
            value={availableCards}
            id="availableCards"
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
    cardType: PropTypes.oneOf(['number', 'image']).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
