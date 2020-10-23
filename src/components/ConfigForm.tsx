import React, { useCallback, useState } from 'react'
import { Dialog } from '@reach/dialog'
import PropTypes from 'prop-types'

import { configPropTypes } from '../utils'
import Input, { Label } from './Input'
import presets, { PresetName } from '../presets'
import styles from './ConfigForm.module.css'
import Card from './Card'
import Btn from './Btn'

const ConfigForm: React.FC<Props> = ({ onClose, onSubmit, currentConfig }) => {
  const [message, setMessage] = useState<string | null>(null)

  const [playerCardsAmount, setPlayerCardsAmount] = useState<
    number | undefined
  >(currentConfig.playerCardsAmount)

  const [minDivisor, setMinDivisor] = useState<number | undefined>(
    currentConfig.minDivisor
  )

  const [maxDivisor, setMaxDivisor] = useState<number | undefined>(
    currentConfig.maxDivisor
  )

  const [availableCards, setAvailableCards] = useState(
    currentConfig.availableCards.join(', ')
  )

  const [cardType, setCardType] = useState(currentConfig.cardType)

  const handlePreset: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (ev) => {
      if (typeof ev.currentTarget.dataset.presetId !== 'string') return
      const { options } = presets[
        ev.currentTarget.dataset.presetId as PresetName
      ]
      setPlayerCardsAmount(options.playerCardsAmount)
      setMinDivisor(options.minDivisor)
      setMaxDivisor(options.maxDivisor)
      setAvailableCards(options.availableCards.join(', '))
      setCardType(options.cardType)
    },
    []
  )

  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault()
      const parsedAvailableCards = availableCards
        .split(',')
        .map((v) => parseInt(v, 10))
        .filter((v) => v && v >= 0)

      if (playerCardsAmount === undefined) {
        setMessage('La cantidad de cartas por jugador es requerida')
        return
      }
      if (2 * playerCardsAmount > parsedAvailableCards.length) {
        setMessage('Se necesitan más cartas en el mazo')
        return
      }
      if (parsedAvailableCards.some((v) => v <= 1)) {
        setMessage('El mazo no debe contener cartas de valor mayor a 1')
        return
      }

      if (minDivisor === undefined) {
        setMessage('El divisor mínimo es requerido')
        return
      }
      if (minDivisor <= 1) {
        setMessage('El divisor mínimo debe ser mayor a 1')
        return
      }

      if (maxDivisor === undefined) {
        setMessage('El divisor máximo es requerido')
        return
      }
      if (maxDivisor <= 1) {
        setMessage('El divisor máximo debe ser mayor a 1')
        return
      }
      if (maxDivisor < minDivisor) {
        setMessage('El divisor máximo debe ser mayor o igual al divisor mínimo')
        return
      }
      setMessage(null)
      onClose()
      onSubmit({
        playerCardsAmount,
        availableCards: parsedAvailableCards,
        minDivisor,
        maxDivisor,
        cardType,
      })
    },
    [
      playerCardsAmount,
      availableCards,
      minDivisor,
      maxDivisor,
      onSubmit,
      cardType,
      onClose,
    ]
  )

  const handleImageCardTypeSelect = useCallback(() => setCardType('image'), [])
  const handleNumberCardTypeSelect = useCallback(
    () => setCardType('number'),
    []
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
              {(Object.keys(presets) as PresetName[]).map((id) => (
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
              label="Cartas del mazo"
              onChange={setAvailableCards}
              required
              type="text"
              value={availableCards}
              rows={2}
              id="availableCards"
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
              mt="1.5em"
            />
          </div>

          <div className={styles.col}>
            <Input
              label="Divisor mínimo"
              onChange={setMinDivisor}
              required
              value={minDivisor}
              type="number"
              min="2"
              id="minDivisor"
              mb="1.25em"
            />

            <Input
              label="Divisor máximo"
              onChange={setMaxDivisor}
              required
              value={maxDivisor}
              type="number"
              min={minDivisor}
              id="maxDivisor"
              mb="1.25em"
            />

            <Label>Tipo de carta</Label>
            <div className={styles.cardTypesContainer}>
              <label className={styles.cardIcon} htmlFor="cardType-image">
                <input
                  className="visuallyHidden"
                  onChange={handleImageCardTypeSelect}
                  tabIndex={-1}
                  checked={cardType === 'image'}
                  value="image"
                  name="cardType"
                  type="radio"
                  id="cardType-image"
                />
                <Card
                  isSelected={cardType === 'image'}
                  onClick={handleImageCardTypeSelect}
                  value={5}
                  type="image"
                  id={-1}
                />
                <span className="visuallyHidden">Dibujos</span>
              </label>
              <label className={styles.cardIcon} htmlFor="cardType-number">
                <input
                  className="visuallyHidden"
                  onChange={handleNumberCardTypeSelect}
                  tabIndex={-1}
                  checked={cardType === 'number'}
                  value="number"
                  name="cardType"
                  type="radio"
                  id="cardType-number"
                />
                <Card
                  isSelected={cardType === 'number'}
                  onClick={handleNumberCardTypeSelect}
                  value={5}
                  type="number"
                  id={-2}
                />
                <span className="visuallyHidden">Número</span>
              </label>
            </div>
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

const ConfigFormPropTypes = {
  currentConfig: configPropTypes.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

ConfigForm.propTypes = ConfigFormPropTypes

type Props = PropTypes.InferProps<typeof ConfigFormPropTypes>

export default ConfigForm
