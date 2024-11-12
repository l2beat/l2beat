import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { InsightBalance } from '../../kysely/generated/types'

export interface InsightBalanceRecord {
  id: string
  userId: string
  tokenId: string
  balance: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableInsightBalanceRecord = Omit<
  Insertable<InsightBalance>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRecord(
  record: UpsertableInsightBalanceRecord,
): Insertable<InsightBalance> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
