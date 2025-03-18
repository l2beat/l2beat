import type { TvsPrice } from '../../kysely/generated/types'

export const selectTvsPrice = [
  'timestamp',
  'configurationId',
  'priceId',
  'priceUsd',
] as const satisfies (keyof TvsPrice)[]
