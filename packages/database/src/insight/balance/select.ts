import { InsightBalance } from '../../kysely/generated/types'

export const selectInsightBalance = [
  'id',
  'userId',
  'tokenId',
  'balance',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof InsightBalance)[]
