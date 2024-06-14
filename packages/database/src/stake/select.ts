import { Stake } from '../kysely/generated/types'

export const selectStake = [
  'chainId',
  'totalStake',
  'thresholdStake',
] as const satisfies (keyof Stake)[]
