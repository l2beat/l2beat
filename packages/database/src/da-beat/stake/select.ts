import type { Stake } from '../../kysely/generated/types'

export const selectStake = [
  'id',
  'totalStake',
  'thresholdStake',
] as const satisfies (keyof Stake)[]
