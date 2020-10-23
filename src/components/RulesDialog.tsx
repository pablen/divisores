import React, { useState, useCallback } from 'react'
import { Dialog } from '@reach/dialog'
import PropTypes from 'prop-types'

import { configPropTypes } from '../utils'
import Checkbox from './Checkbox'
import styles from './RulesDialog.module.css'
import Btn from './Btn'

const RulesDialog: React.FC<Props> = ({ onClose, currentConfig }) => {
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
          Seleccionar una carta de la mesa con una carta propia cuyo valor sea
          divisor.
        </p>
        <p>Intentar formar todos los pares de cartas de cada mano.</p>

        <div className={styles.checkboxContainer}>
          <Checkbox onChange={setDoNotShowAgain} checked={doNotShowAgain}>
            No volver a mostrar
          </Checkbox>
        </div>

        <div className={styles.controls}>
          <Btn onClick={handleStart} autoFocus>
            ¡EMPEZAR!
          </Btn>
        </div>
      </div>
    </Dialog>
  )
}

const RulesDialogPropTypes = {
  currentConfig: configPropTypes.isRequired,
  onClose: PropTypes.func.isRequired,
}

RulesDialog.propTypes = RulesDialogPropTypes

type Props = PropTypes.InferProps<typeof RulesDialogPropTypes>

export default RulesDialog
