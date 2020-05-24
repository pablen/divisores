import PropTypes from 'prop-types'
import React from 'react'

import styles from './ScoreBoard.module.css'

export default function ScoreBoard({
  playerStackLength,
  aiStackLength,
  playerSweeps,
  aiSweeps,
}) {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <th className={styles.header} />
          <th className={styles.header}>Escobas</th>
          <th className={styles.header}>Cartas Acumuladas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Vos</td>
          <td className={styles.center}>{playerSweeps}</td>
          <td className={styles.center}>{playerStackLength}</td>
        </tr>
        <tr>
          <td>
            <span className="visuallyHidden">Máquina</span>🤖
          </td>
          <td className={styles.center}>{aiSweeps}</td>
          <td className={styles.center}>{aiStackLength}</td>
        </tr>
      </tbody>
    </table>
  )
}

ScoreBoard.propTypes = {
  playerStackLength: PropTypes.number.isRequired,
  aiStackLength: PropTypes.number.isRequired,
  playerSweeps: PropTypes.number.isRequired,
  aiSweeps: PropTypes.number.isRequired,
}
