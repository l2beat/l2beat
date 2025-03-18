import type { TvsAmount } from '../../kysely/generated/types'

export const selectTvsAmount = [
  'timestamp',
  'configurationId',
  'project',
  'amount',
] as const satisfies (keyof TvsAmount)[]
