const EMPTY = {
  name: 'Empty',
  description: 'No information available.',
  references: [],
  risks: [],
}

const UPCOMING = {
  stateCorrectness: EMPTY,
  dataAvailability: EMPTY,
  operator: EMPTY,
  forceTransactions: EMPTY,
  exitMechanisms: [],
}

const UNDER_REVIEW = {
  ...UPCOMING,
  isUnderReview: true,
}

export const TECHNOLOGY = {
  UPCOMING,
  UNDER_REVIEW,
}
