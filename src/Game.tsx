import { AnimateSharedLayout } from 'framer-motion'
import PropTypes from 'prop-types'
import React from 'react'

import { ConfigOptions } from './presets'
import { init, reducer } from './store'
import CardPlaceholder from './components/CardPlaceholder'
import RulesDialog from './components/RulesDialog'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import * as utils from './utils'
import styles from './Game.module.css'
import Card from './components/Card'
import Btn from './components/Btn'

const Game: React.FC<Props> = ({ initialConfig, showRules, shuffle }) => {
  React.useEffect(() => {
    if (!config.isDebugEnabled) return
    console.log(
      '%cInitial configuration',
      'font-weight: bold; color: blue;',
      initialConfig
    )
  }, [initialConfig])

  const [state, dispatch] = React.useReducer(
    reducer,
    {
      shuffledStack: shuffle({
        playerCardsAmount: initialConfig.playerCardsAmount,
        availableCards: initialConfig.availableCards,
        minDivisor: initialConfig.minDivisor,
        maxDivisor: initialConfig.maxDivisor,
      }),
      config: initialConfig,
    },
    init
  )
  const [isConfigVisible, setIsConfigVisible] = React.useState(false)
  const [isRulesVisible, setIsRulesVisible] = React.useState(showRules)

  const hasStackEnoughCards =
    state.stackCards.length >= 2 * state.config.playerCardsAmount

  const hasPlayerCards = state.playerCards.length > 0

  const isGameFinished = !hasPlayerCards && !hasStackEnoughCards

  const canPlay =
    !isGameFinished &&
    state.selectedPlayerCard !== null &&
    state.selectedTableCard !== null

  React.useEffect(() => {
    if (isGameFinished) return
    if (!hasPlayerCards) {
      setTimeout(() => dispatch({ type: 'new cards requested' }), 500)
    }
  }, [isGameFinished, hasPlayerCards, isRulesVisible])

  const handleConfigClick = React.useCallback(
    () => setIsConfigVisible((s) => !s),
    []
  )

  const handleTableCardSelected = React.useCallback(
    (cardId) => dispatch({ type: 'table card selected', payload: cardId }),
    []
  )
  const handlePlayAgain = React.useCallback(
    () =>
      dispatch({
        type: 'reset',
        payload: {
          shuffledStack: shuffle({
            playerCardsAmount: state.config.playerCardsAmount,
            availableCards: state.config.availableCards,
            minDivisor: state.config.minDivisor,
            maxDivisor: state.config.maxDivisor,
          }),
        },
      }),
    [
      state.config.playerCardsAmount,
      state.config.availableCards,
      state.config.minDivisor,
      state.config.maxDivisor,
      shuffle,
    ]
  )
  const handlePlayerCardSelected = React.useCallback(
    (cardId) => dispatch({ type: 'player card selected', payload: cardId }),
    []
  )
  const handlePlay = React.useCallback(
    () => dispatch({ type: 'play attempted' }),
    []
  )
  const handleRulesDialogClose = React.useCallback(
    () => setIsRulesVisible(false),
    []
  )
  const handleConfigFormClose = React.useCallback(
    () => setIsConfigVisible(false),
    []
  )
  const handleConfigUpdated = React.useCallback(
    (newConfig: ConfigOptions) =>
      dispatch({
        type: 'config updated',
        payload: {
          shuffledStack: shuffle({
            playerCardsAmount: newConfig.playerCardsAmount,
            availableCards: newConfig.availableCards,
            minDivisor: newConfig.minDivisor,
            maxDivisor: newConfig.maxDivisor,
          }),
          newConfig,
        },
      }),
    [shuffle]
  )

  const hasValidPlays =
    !hasPlayerCards ||
    state.playerCards.some((playerIdx) =>
      state.tableCards.some((tableIdx) => {
        const playerCard = state.shuffledStack[playerIdx]
        const tableCard = state.shuffledStack[tableIdx]
        return (
          Math.max(playerCard, tableCard) % Math.min(playerCard, tableCard) ===
          0
        )
      })
    )

  const userMessage = isGameFinished
    ? ''
    : hasValidPlays
    ? state.userMessage
    : 'No quedan jugadas posibles!'

  return (
    <div className={styles.container}>
      <button
        className={styles.configBtn}
        onClick={handleConfigClick}
        title="Configuración"
        type="button"
      >
        <span className="visuallyHidden">Configuración</span>⚙️
      </button>

      <AnimateSharedLayout>
        <section
          className={[
            styles.tableSection,
            isGameFinished ? styles.gameFinished : '',
          ].join(' ')}
        >
          <div className={styles.tableSide}>
            <div className={styles.deckContainer}>
              <CardPlaceholder className={styles.placeholder} />
              {state.stackCards.map((card) => (
                <Card
                  isReversed
                  value={state.shuffledStack[card]}
                  type={state.config.cardType}
                  key={`card-${card}`}
                  id={card}
                />
              ))}
            </div>
          </div>
          <div className={styles.tableCards} data-testid="tableCards">
            {state.tableCards.map((card) => (
              <Card
                isSelected={state.selectedTableCard === card}
                isDisabled={isGameFinished}
                onClick={handleTableCardSelected}
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
          {isGameFinished && (
            <div className={styles.gameSummary} data-testid="gameSummary">
              <div className={styles.gameResult}>Partida Terminada</div>
              <Btn autoFocus onClick={handlePlayAgain} type="button">
                Jugar De Nuevo
              </Btn>
            </div>
          )}
        </section>

        <section className={`${styles.messageSection} ${styles.userMessage}`}>
          {userMessage}
          {!hasValidPlays && (
            <Btn
              className={styles.okBtn}
              autoFocus
              onClick={() => dispatch({ type: 'discard remaining cards' })}
            >
              OK
            </Btn>
          )}
        </section>

        <section className={styles.playerSection}>
          <div className={styles.playerCards} data-testid="playerCards">
            {state.playerCards.map((card) => (
              <Card
                isSelected={state.selectedPlayerCard === card}
                onClick={handlePlayerCardSelected}
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
          <div className={styles.playerDeck}>
            {state.playerStack.map((card) => (
              <Card
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
        </section>

        <section className={styles.controlsSection}>
          {!isGameFinished && canPlay && (
            <Btn
              data-testid="play-btn"
              className={styles.controlBtn}
              disabled={!canPlay}
              onClick={handlePlay}
              type="button"
            >
              Jugar
            </Btn>
          )}
        </section>
      </AnimateSharedLayout>

      {isRulesVisible && (
        <RulesDialog
          currentConfig={state.config}
          onClose={handleRulesDialogClose}
        />
      )}

      {isConfigVisible && (
        <ConfigForm
          currentConfig={state.config}
          onSubmit={handleConfigUpdated}
          onClose={handleConfigFormClose}
        />
      )}
    </div>
  )
}

const GamePropTypes = {
  initialConfig: utils.configPropTypes.isRequired,
  showRules: PropTypes.bool.isRequired,
  shuffle: PropTypes.func.isRequired,
}

Game.propTypes = GamePropTypes

type Props = Omit<PropTypes.InferProps<typeof GamePropTypes>, 'shuffle'> & {
  shuffle(args: Omit<ConfigOptions, 'cardType'>): number[]
}

export default Game
