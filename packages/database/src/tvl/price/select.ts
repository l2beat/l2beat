import type { Price } from '../../kysely/generated/types'

export const selectPrice = [
  'configurationId',
  'priceUsd',
  'timestamp',
] as const satisfies (keyof Price)[]
