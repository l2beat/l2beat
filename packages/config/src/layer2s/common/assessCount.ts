import { AssessCount } from '../types'

export const subtractOne: AssessCount = (count) => count - 1

export const subtractOneAfterBlock: (blockNumber: number) => AssessCount = () =>
  subtractOne
