import type { RealTimeLiveness } from '../../kysely/generated/types'

export const selectLiveness = [
  'configurationId',
  'txHash',
  'timestamp',
  'blockNumber',
] as const satisfies (keyof RealTimeLiveness)[]
