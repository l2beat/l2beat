import type { TvsPrice } from '../../kysely/generated/types'

export const selectTvsPrice = [
  'configurationId',
  'timestamp',
  'priceUsd',
  'priceId',
] as const satisfies (keyof TvsPrice)[]
