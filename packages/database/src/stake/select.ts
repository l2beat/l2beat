import { Stake } from '../kysely/generated/types'

export const selectStake = [
  'assetId',
  'chainId',
  'totalStake',
  'thresholdStake',
] as const satisfies (keyof Stake)[]
