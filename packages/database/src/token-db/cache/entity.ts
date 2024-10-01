import { Insertable } from 'kysely'
import { Cache } from '../../kysely/generated/types'

export interface CacheRecord {
  key: string
  value: string
  chainId: number
  blockNumber: number | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableCacheRecord = Omit<
  Insertable<Cache>,
  'createdAt' | 'updatedAt'
>

export function upsertableToRow(
  upsertable: UpsertableCacheRecord,
): Insertable<Cache> {
  return {
    ...upsertable,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
