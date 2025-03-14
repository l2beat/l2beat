import type { TvsPrice } from '../../kysely/generated/types'

export const selectTvsPrice = [
  'priceId',
  'timestamp',
  'priceUsd',
] as const satisfies (keyof TvsPrice)[]
