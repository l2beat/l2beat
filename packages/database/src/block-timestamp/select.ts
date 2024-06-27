import { BlockTimestamp } from '../kysely/generated/types'

export const selectBlockTimestamp = [
  'block_number',
  'chain',
  'timestamp',
] as const satisfies (keyof BlockTimestamp)[]
