import { Dialog } from '@reach/dialog'
import PropTypes from 'prop-types'
import React from 'react'

import { configPropTypes } from '../utils'
import styles from './RulesDialog.module.css'
// import Card from './Card'

export default function RulesDialog({ onClose, currentConfig }) {
  return (
    <Dialog
      aria-labelledby="dialog-title"
      className={styles.container}
      onDismiss={onClose}
    >
      <div className={styles.wrapper}>
        <h2 className={styles.title} id="dialog-title">
          Reglas del juego
        </h2>
        <p>
          Intentar reunir la mayor cantidad de cartas de la mesa con una de las
          propias que sumen <strong>{currentConfig.targetValue} puntos</strong>.
        </p>
        <p>
          Levantar todas las cartas de la mesa suma una <strong>escoba</strong>.
        </p>
        <p>
          Si no hay cartas en la mesa o no se puede sumar{' '}
          {currentConfig.targetValue} puntos se debe <strong>descartar</strong>.
        </p>
        <p>
          Una vez jugadas las cartas iniciales, se reparten{' '}
          {currentConfig.playerCardsAmount} cartas nuevamente a cada jugador
          hasta que no queden más en el mazo.
        </p>
        <p>
          Al terminar el juego los puntos se asignan de la siguiente manera:
        </p>
        <p>
          <strong>1 punto por cada escoba.</strong>
        </p>
        <p>
          <strong>1 punto al que tiene más cartas.</strong>
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={onClose} autoFocus>
            ¡EMPEZAR!
          </button>
        </div>
      </div>
    </Dialog>
  )
}

RulesDialog.propTypes = {
  currentConfig: configPropTypes.isRequired,
  onClose: PropTypes.func.isRequired,
}
