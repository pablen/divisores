import PropTypes from 'prop-types'
import React from 'react'

import styles from './ScoreBoard.module.css'

export default function ScoreBoard({
  playerStackLength,
  aiStackLength,
  playerSweeps,
  playerPoints,
  aiPoints,
  aiSweeps,
}) {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <th className={styles.header} />
          <th className={styles.header}>Vos</th>
          <th className={styles.header}>
            <span className="visuallyHidden">Máquina</span>🤖
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Por cartas acumuladas</td>
          <td>
            {playerStackLength > aiStackLength ? '1' : '0'}{' '}
            <span className={styles.cardsAmount}>
              ({playerStackLength} cartas)
            </span>
          </td>
          <td>
            {playerStackLength < aiStackLength ? '1' : '0'}{' '}
            <span className={styles.cardsAmount}>({aiStackLength} cartas)</span>
          </td>
        </tr>
        <tr>
          <td>Por escobas</td>
          <td>{playerSweeps}</td>
          <td>{aiSweeps}</td>
        </tr>
        <tr>
          <td>Puntos</td>
          <td className={playerPoints > aiPoints ? styles.win : styles.loose}>
            {playerPoints}
          </td>
          <td className={playerPoints < aiPoints ? styles.win : styles.loose}>
            {aiPoints}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

ScoreBoard.propTypes = {
  playerStackLength: PropTypes.number.isRequired,
  aiStackLength: PropTypes.number.isRequired,
  playerSweeps: PropTypes.number.isRequired,
  playerPoints: PropTypes.number.isRequired,
  aiPoints: PropTypes.number.isRequired,
  aiSweeps: PropTypes.number.isRequired,
}
