export type PresetName = 'cartas3' | 'cartas4' | 'cartas5'
export type CardType = 'image' | 'number'

export type ConfigOptions = {
  /** Card values the player can get */
  availableCards: number[]

  /** The amount of cards the player starts the game with */
  playerCardsAmount: number

  /** The minimum divisor used to generate table cards values */
  minDivisor: number

  /** The maximum divisor used to generate table cards values */
  maxDivisor: number

  /**
   * The cards design variant.
   * Some variants can be restricted to certain value ranges.
   */
  cardType: CardType
}

type Presets = {
  [name in PresetName]: {
    label: string
    options: ConfigOptions
  }
}

const presets: Presets = {
  cartas3: {
    label: '3 cartas',
    options: {
      availableCards: [2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 11, 11, 13, 17, 19],
      playerCardsAmount: 3,
      minDivisor: 2,
      maxDivisor: 10,
      cardType: 'image',
    },
  },

  cartas4: {
    label: '4 cartas',
    options: {
      availableCards: [2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 11, 11, 13, 17, 19],
      playerCardsAmount: 4,
      minDivisor: 2,
      maxDivisor: 10,
      cardType: 'image',
    },
  },

  cartas5: {
    label: '5 cartas',
    options: {
      availableCards: [2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 11, 11, 13, 17, 19],
      playerCardsAmount: 5,
      minDivisor: 2,
      maxDivisor: 10,
      cardType: 'number',
    },
  },
}

export default presets
