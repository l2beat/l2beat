import type { Amount } from '../../kysely/generated/types'

export const selectAmount = [
  'amount',
  'timestamp',
  'configurationId',
] as const satisfies (keyof Amount)[]
