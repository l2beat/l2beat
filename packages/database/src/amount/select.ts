import { Amount } from '../kysely/generated/types'

export const selectAmount = [
  'amount',
  'timestamp',
  'configuration_id',
] as const satisfies (keyof Amount)[]
