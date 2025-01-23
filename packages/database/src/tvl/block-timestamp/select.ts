import type { BlockTimestamp } from '../../kysely/generated/types'

export const selectBlockTimestamp = [
  'blockNumber',
  'chain',
  'timestamp',
] as const satisfies (keyof BlockTimestamp)[]
