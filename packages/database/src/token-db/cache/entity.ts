import { Insertable, Selectable } from 'kysely'
import { Cache } from '../../kysely/generated/types'

export interface CacheRecord {
  key: string
  value: string
  chainId: number
  blockNumber: number | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<Cache>): CacheRecord {
  return row
}

export function toRow(record: CacheRecord): Insertable<Cache> {
  return record
}
