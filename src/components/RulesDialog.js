import React, { useState, useCallback } from 'react'
import { Dialog } from '@reach/dialog'
import PropTypes from 'prop-types'

import { configPropTypes } from '../utils'
import styles from './RulesDialog.module.css'

export default function RulesDialog({ onClose, currentConfig }) {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)

  const handleStart = useCallback(() => {
    if (doNotShowAgain) {
      window.localStorage.setItem('showRules', 'false')
    }
    onClose()
  }, [doNotShowAgain, onClose])

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
          Si no se puede jugar se debe <strong>descartar</strong>.
        </p>
        <p>
          Levantar todas las cartas de la mesa suma una <strong>escoba</strong>.
        </p>
        <p>
          Al finalizar el juego los puntos se asignan de la siguiente manera:
        </p>
        <p>
          <strong>1 punto por cada escoba.</strong>
        </p>
        <p>
          <strong>1 punto al que juntó más cartas.</strong>
        </p>
        <label className={styles.doNotShowAgain}>
          <input
            onChange={(e) => setDoNotShowAgain(e.target.checked)}
            checked={doNotShowAgain}
            type="checkbox"
          />
          No volver a mostrar
        </label>
        <div className={styles.controls}>
          <button type="button" onClick={handleStart} autoFocus>
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
