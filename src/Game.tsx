import React, {
  useCallback,
  useReducer,
  useEffect,
  useState,
  useRef,
} from 'react'
import { AnimateSharedLayout } from 'framer-motion'
import arrayShuffle from 'array-shuffle'
import PropTypes from 'prop-types'

import { ConfigOptions } from './presets'
import { init, reducer } from './store'
import CardPlaceholder from './components/CardPlaceholder'
import RulesDialog from './components/RulesDialog'
import * as config from './config'
import ConfigForm from './components/ConfigForm'
import ScoreBoard from './components/ScoreBoard'
import * as utils from './utils'
import styles from './Game.module.css'
import Card from './components/Card'
import Btn from './components/Btn'

const Game: React.FC<Props> = ({ initialConfig, showRules }) => {
  useEffect(() => {
    if (!config.isDebugEnabled) return
    console.log(
      '%cInitial configuration',
      'font-weight: bold; color: blue;',
      initialConfig
    )
  }, [initialConfig])

  const [state, dispatch] = useReducer(
    reducer,
    {
      shuffledStack: arrayShuffle(initialConfig.availableCards),
      isPlayerTurn: utils.getRandomTurn(),
      config: initialConfig,
    },
    init
  )
  const [isConfigVisible, setIsConfigVisible] = useState(false)
  const [isRulesVisible, setIsRulesVisible] = useState(showRules)

  const hasStackEnoughCards =
    state.stackCards.length >= 2 * state.config.playerCardsAmount

  const hasPlayerCards = state.playerCards.length > 0

  const hasAiCards = state.aiCards.length > 0

  const isGameFinished = !hasPlayerCards && !hasAiCards && !hasStackEnoughCards

  const playerPoints =
    state.playerSweeps +
    (state.playerStack.length > state.aiStack.length ? 1 : 0)

  const aiPoints =
    state.aiSweeps + (state.aiStack.length > state.playerStack.length ? 1 : 0)

  const canDiscard =
    !isGameFinished && state.isPlayerTurn && state.selectedPlayerCard !== null

  const canPlay =
    !isGameFinished &&
    state.isPlayerTurn &&
    state.selectedPlayerCard !== null &&
    state.selectedTableCards.length > 0

  const timer = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (state.config.hintsDelay > 0 && state.isPlayerTurn && hasPlayerCards) {
      timer.current = setTimeout(
        () => dispatch({ type: 'hint requested' }),
        state.config.hintsDelay * 1000
      )
    } else {
      if (timer.current !== null) clearTimeout(timer.current)
    }
  }, [state.isPlayerTurn, hasPlayerCards, state.config.hintsDelay])

  useEffect(() => {
    if (state.selectedAiCard !== null && !state.config.pauseOnAiPlay) {
      setTimeout(() => dispatch({ type: 'ai played' }), 2 * config.aiPlayDelay)
    }
  }, [state.selectedAiCard, state.config.pauseOnAiPlay])

  useEffect(() => {
    if (isGameFinished) return
    if (
      (state.isPlayerTurn && !hasPlayerCards) ||
      (!state.isPlayerTurn && !hasAiCards)
    ) {
      setTimeout(
        () => dispatch({ type: 'new cards requested' }),
        config.aiPlayDelay
      )
      return
    }
    if (!state.isPlayerTurn && !isRulesVisible) {
      setTimeout(
        () => dispatch({ type: 'ai play requested' }),
        config.aiPlayDelay
      )
    }
  }, [
    state.isPlayerTurn,
    isGameFinished,
    hasPlayerCards,
    isRulesVisible,
    hasAiCards,
  ])

  const aiMessage =
    isGameFinished || state.isPlayerTurn ? (
      ''
    ) : state.selectedAiCard === null ? (
      'Esperando a que juege la máquina...'
    ) : state.selectedTableCards.length === 0 ? (
      `La máquina se descarta un ${state.shuffledStack[state.selectedAiCard]}`
    ) : (
      <>
        La máquina juega{' '}
        <span className={styles.condensed}>
          {[
            state.shuffledStack[state.selectedAiCard],
            ...state.selectedTableCards.map((i) => state.shuffledStack[i]),
          ].join(' + ')}{' '}
          = {state.config.targetValue}
        </span>
      </>
    )

  const userMessage = isGameFinished
    ? ''
    : state.userMessage || (state.isPlayerTurn ? 'Tu Turno' : '')

  const handleConfigClick = useCallback(() => setIsConfigVisible((s) => !s), [])
  const handleOkClick = useCallback(
    () => dispatch({ type: 'ai play accepted' }),
    []
  )
  const handleTableCardSelected = useCallback(
    (cardId) =>
      dispatch({
        type: 'table card selected',
        payload: cardId,
      }),
    []
  )
  const handlePlayAgain = useCallback(
    () =>
      dispatch({
        type: 'reset',
        payload: {
          shuffledStack: arrayShuffle(state.config.availableCards),
        },
      }),
    [state.config.availableCards]
  )
  const handlePlayerCardSelected = useCallback(
    (cardId) => dispatch({ type: 'player card selected', payload: cardId }),
    []
  )
  const handlePlayOrDiscard = useCallback(
    () =>
      dispatch({
        type: canPlay ? 'play attempted' : 'player card discarded',
      }),
    [canPlay]
  )
  const handleRulesDialogClose = useCallback(() => setIsRulesVisible(false), [])
  const handleConfigFormClose = useCallback(() => setIsConfigVisible(false), [])
  const handleConfigUpdated = useCallback(
    (newConfig: ConfigOptions) =>
      dispatch({
        type: 'config updated',
        payload: {
          shuffledStack: arrayShuffle(newConfig.availableCards),
          newConfig,
        },
      }),
    []
  )

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
        <section className={styles.aiSection}>
          <div className={styles.aiCards}>
            {state.aiCards.map((card) => (
              <Card
                isReversed={state.selectedAiCard !== card}
                isSelected={state.selectedAiCard === card}
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
          <div className={styles.aiDeck}>
            {state.aiStack.map((card) => (
              <Card
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
        </section>

        <section className={`${styles.messageSection} ${styles.aiMessage}`}>
          {aiMessage}
          {state.selectedAiCard !== null && state.config.pauseOnAiPlay && (
            <Btn className={styles.okBtn} autoFocus onClick={handleOkClick}>
              OK
            </Btn>
          )}
        </section>

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
          <div className={styles.tableCards}>
            {state.tableCards.map((card) => (
              <Card
                isSelected={state.selectedTableCards.includes(card)}
                isDisabled={isGameFinished || !state.isPlayerTurn}
                isHinted={state.hint.includes(card)}
                onClick={handleTableCardSelected}
                value={state.shuffledStack[card]}
                type={state.config.cardType}
                key={`card-${card}`}
                id={card}
              />
            ))}
          </div>
          {isGameFinished && (
            <div className={styles.gameSummary}>
              <div className={styles.gameResult}>
                {playerPoints > aiPoints
                  ? '🏆 ¡Ganaste! 🏆'
                  : playerPoints < aiPoints
                  ? 'Perdiste'
                  : 'Empate'}
              </div>
              <ScoreBoard
                playerStackLength={state.playerStack.length}
                aiStackLength={state.aiStack.length}
                playerSweeps={state.playerSweeps}
                playerPoints={playerPoints}
                aiSweeps={state.aiSweeps}
                aiPoints={aiPoints}
              />
              <Btn autoFocus onClick={handlePlayAgain} type="button">
                Jugar De Nuevo
              </Btn>
            </div>
          )}
        </section>

        <section className={`${styles.messageSection} ${styles.userMessage}`}>
          {userMessage}
        </section>

        <section className={styles.playerSection}>
          <div className={styles.playerCards}>
            {state.playerCards.map((card) => (
              <Card
                isSelected={state.selectedPlayerCard === card}
                isDisabled={!state.isPlayerTurn}
                isHinted={state.hint.includes(card)}
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
          {!isGameFinished && (canPlay || canDiscard) && (
            <Btn
              className={styles.controlBtn}
              disabled={!canPlay && !canDiscard}
              onClick={handlePlayOrDiscard}
              type="button"
            >
              {canPlay ? 'Jugar' : 'Descartar'}
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
}

Game.propTypes = GamePropTypes

type Props = PropTypes.InferProps<typeof GamePropTypes>

export default Game
