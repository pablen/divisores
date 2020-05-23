export default {
  del10: {
    label: 'Sumar 10',
    options: {
      // prettier-ignore
      availableCards : [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5,
        6, 6, 7, 7, 8, 8, 9],
      targetValue: 10,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'image',
    },
  },

  del15: {
    label: 'Sumar 15',
    options: {
      // prettier-ignore
      availableCards : [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5,
        6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 11, 12, 13, 14],
      targetValue: 15,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'image',
    },
  },

  del100: {
    label: 'Sumar 100',
    options: {
      // prettier-ignore
      availableCards : [10, 10, 10, 10, 10, 20, 20, 20, 30, 30, 30, 40, 40,
        50, 50, 60, 60, 70, 70, 80, 80, 90],
      targetValue: 100,
      tableCardsAmount: 4,
      playerCardsAmount: 3,
      cardType: 'number',
    },
  },
}
