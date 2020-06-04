export type PresetName = 'del10' | 'del15' | 'del100'
export type CardType = 'image' | 'number'

export type ConfigOptions = {
  /** Card values included in the game deck */
  availableCards: number[]

  /** The value that played cards must sum up to */
  targetValue: number

  /** The amount of cards on the table the game starts with */
  tableCardsAmount: number

  /** The amount of cards each player starts the game with */
  playerCardsAmount: number

  /**
   * The cards design variant.
   * Some variants can be restricted to certain value ranges.
   */
  cardType: CardType

  /** Wether to require the user to manually confirm an AI play */
  pauseOnAiPlay: boolean

  /**
   * The amount of seconds to wait before hinting the best possible play.
   * Use 0 to disable hints.
   */
  hintsDelay: number
}

type Presets = {
  [name in PresetName]: {
    label: string
    options: ConfigOptions
  }
}

const presets: Presets = {
  del10: {
    label: 'Sumar 10',
    options: {
      // prettier-ignore
      availableCards : [1, 1, 1, 1, 1, 2, 2, 2, 3,
        3, 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9],
      targetValue: 10,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'image',
      pauseOnAiPlay: true,
      hintsDelay: 5,
    },
  },

  del15: {
    label: 'Sumar 15',
    options: {
      // prettier-ignore
      availableCards : [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5,
        5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 11, 12, 13, 14],
      targetValue: 15,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'image',
      pauseOnAiPlay: true,
      hintsDelay: 5,
    },
  },

  del100: {
    label: 'Sumar 100',
    options: {
      // prettier-ignore
      availableCards : [10, 10, 10, 10, 10, 20, 20, 20, 30,
        30, 30, 40, 40, 50, 50, 60, 60, 70, 70, 80, 80, 90],
      targetValue: 100,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'number',
      pauseOnAiPlay: true,
      hintsDelay: 5,
    },
  },
}

export default presets
