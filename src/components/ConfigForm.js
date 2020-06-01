import React, { useCallback, useState } from 'react'
import { Dialog } from '@reach/dialog'
import PropTypes from 'prop-types'

import { configPropTypes } from '../utils'
import Input, { Label } from './Input'
import Checkbox from './Checkbox'
import presets from '../presets'
import styles from './ConfigForm.module.css'
import Card from './Card'
import Btn from './Btn'

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

  const [useHints, setUseHints] = useState(currentConfig.hintsDelay > 0)
  const [hintsDelay, setHintsDelay] = useState(currentConfig.hintsDelay || 5)

  const handleUseHintsToggle = useCallback((newValue) => {
    if (newValue) {
      setHintsDelay(5)
    }
    setUseHints(newValue)
  }, [])

  const handlePreset = useCallback((e) => {
    const { options } = presets[e.target.dataset.presetId]
    setPlayerCardsAmount(options.playerCardsAmount)
    setTableCardsAmount(options.tableCardsAmount)
    setAvailableCards(options.availableCards.join(', '))
    setPauseOnAiPlay(options.pauseOnAiPlay)
    setTargetValue(options.targetValue)
    setHintsDelay(options.hintsDelay)
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
        hintsDelay: useHints ? hintsDelay : 0,
        cardType,
      })
    },
    [
      playerCardsAmount,
      tableCardsAmount,
      availableCards,
      pauseOnAiPlay,
      targetValue,
      hintsDelay,
      onSubmit,
      cardType,
      useHints,
      onClose,
    ]
  )

  return (
    <Dialog
      aria-labelledby="dialog-title"
      className={styles.container}
      onDismiss={onClose}
    >
      <form className={styles.wrapper} onSubmit={handleSubmit}>
        <h2 className={styles.title} id="dialog-title">
          Configuración
        </h2>

        <div className={styles.row}>
          <div className={styles.col}>
            <Label>Cargar preset</Label>
            <div className={styles.presetRow}>
              {Object.keys(presets).map((id) => (
                <Btn
                  data-preset-id={id}
                  onClick={handlePreset}
                  small
                  key={`preset-${id}`}
                >
                  {presets[id].label}
                </Btn>
              ))}
            </div>

            <Input
              label="Escoba del"
              onChange={setTargetValue}
              required
              value={targetValue}
              type="number"
              min="2"
              id="targetValue"
              mt="1.25em"
            />

            <Input
              label="Cantidad de cartas por jugador"
              onChange={setPlayerCardsAmount}
              required
              value={playerCardsAmount}
              type="number"
              min="1"
              id="playerCardsAmount"
              mt="1.25em"
            />

            <Input
              label="Cantidad de cartas en la mesa"
              onChange={setTableCardsAmount}
              required
              value={tableCardsAmount}
              type="number"
              min="0"
              id="tableCardsAmount"
              mt="1.25em"
            />
          </div>

          <div className={styles.col}>
            <Input
              label="Cartas del mazo"
              onChange={setAvailableCards}
              required
              value={availableCards}
              rows={2}
              id="availableCards"
              mb="1.5em"
            />

            <Label>Tipo de carta</Label>
            <div className={styles.cardTypesContainer}>
              <label className={styles.cardIcon} htmlFor="cardType-image">
                <input
                  className="visuallyHidden"
                  onChange={() => setCardType('image')}
                  tabIndex="-1"
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
                  id="image-icon"
                />
                <span className="visuallyHidden">Dibujos</span>
              </label>
              <label className={styles.cardIcon} htmlFor="cardType-number">
                <input
                  className="visuallyHidden"
                  onChange={(e) => setCardType(e.target.value)}
                  tabIndex="-1"
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
                  id="number-icon"
                />
                <span className="visuallyHidden">Número</span>
              </label>
            </div>

            <Checkbox
              onChange={setPauseOnAiPlay}
              checked={pauseOnAiPlay}
              mt="1.5em"
            >
              Pausar cuando juega la máquina
            </Checkbox>

            <Checkbox
              onChange={handleUseHintsToggle}
              checked={useHints}
              mt="1em"
            >
              Mostrar pistas a los{' '}
              <input
                className={styles.hintDelayField}
                onChange={(e) => {
                  setHintsDelay(
                    isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber
                  )
                }}
                disabled={!useHints}
                required
                value={hintsDelay}
                type="number"
                min="1"
              />
              segundos
            </Checkbox>
          </div>
        </div>

        {message && <p>{message}</p>}

        <div className={styles.controls}>
          <Btn type="submit">Guardar</Btn>
          <Btn onClick={onClose} text>
            Cancelar
          </Btn>
        </div>
      </form>
    </Dialog>
  )
}

ConfigForm.propTypes = {
  currentConfig: configPropTypes.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
