import { InsightUser } from '../../kysely/generated/types'

export const selectInsightUser = [
  'id',
  'address',
  'balancesRefreshedAt',
  'tokensRefreshedAt',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof InsightUser)[]
