import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import presets from '../presets'
import styles from './ConfigForm.module.css'
import Card from './Card'

export default function ConfigForm({ onClose, onSubmit, currentConfig }) {
  const [message, setMessage] = useState(null)

  const [pauseOnAiPlay, setPauseOnAiPlay] = useState(
    currentConfig.pauseOnAiPlay
  )
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

  const handlePreset = useCallback((e) => {
    const { options } = presets[e.target.dataset.presetId]
    setPlayerCardsAmount(options.playerCardsAmount)
    setTableCardsAmount(options.tableCardsAmount)
    setAvailableCards(options.availableCards.join(', '))
    setPauseOnAiPlay(options.pauseOnAiPlay)
    setTargetValue(options.targetValue)
    setCardType(options.cardType)
  }, [])

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
        pauseOnAiPlay,
        targetValue,
        cardType,
      })
    },
    [
      playerCardsAmount,
      tableCardsAmount,
      availableCards,
      pauseOnAiPlay,
      targetValue,
      onSubmit,
      cardType,
      onClose,
    ]
  )

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Configuración</h2>

        <div className={styles.field}>
          <div className={styles.label}>Cargar preset:</div>
          <div className={styles.presetRow}>
            {Object.keys(presets).map((id) => (
              <button
                data-preset-id={id}
                onClick={handlePreset}
                type="button"
                key={`preset-${id}`}
              >
                {presets[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="targetValue">
            Escoba del:
          </label>
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="playerCardsAmount">
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tableCardsAmount">
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

        <div className={styles.field}>
          <label className={styles.checkbox}>
            <input
              onChange={(e) => setPauseOnAiPlay(e.target.checked)}
              checked={pauseOnAiPlay}
              type="checkbox"
            />{' '}
            Pausar cuando juega la máquina
          </label>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Tipo de carta:</div>
          <div className={styles.cardTypesContainer}>
            <label className={styles.label} htmlFor="cardType-image">
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
            <label className={styles.label} htmlFor="cardType-number">
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="availableCards">
            Cartas del mazo:
          </label>
          <textarea
            onChange={(e) => setAvailableCards(e.target.value)}
            required
            value={availableCards}
            id="availableCards"
          />
        </div>

        {message && <p>{message}</p>}

        <div className={styles.controls}>
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
    pauseOnAiPlay: PropTypes.bool.isRequired,
    targetValue: PropTypes.number.isRequired,
    cardType: PropTypes.oneOf(['number', 'image']).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
