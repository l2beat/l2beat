import type { Liveness } from '../../kysely/generated/types'

export const selectLiveness = [
  'configurationId',
  'txHash',
  'blockNumber',
  'timestamp',
] as const satisfies (keyof Liveness)[]
