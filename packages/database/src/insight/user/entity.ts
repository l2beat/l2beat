import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { InsightUser } from '../../kysely/generated/types'

export interface InsightUserRecord {
  id: string
  address: string
  tokensRefreshedAt: Date | null
  balancesRefreshedAt: Date | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableInsightUserRecord = Omit<
  Insertable<InsightUser>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRecord(
  record: UpsertableInsightUserRecord,
): Insertable<InsightUser> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
