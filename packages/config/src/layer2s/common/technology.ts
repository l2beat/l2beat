import { Layer2Technology } from '../types'

const EMPTY = {
  name: 'Empty',
  description: 'No information available.',
  references: [],
  risks: [],
}

const UPCOMING: Layer2Technology = {
  category: 'ZK Rollup',
  stateCorrectness: EMPTY,
  dataAvailability: EMPTY,
  operator: EMPTY,
  forceTransactions: EMPTY,
  exitMechanisms: [],
}

export const TECHNOLOGY = {
  UPCOMING,
}
