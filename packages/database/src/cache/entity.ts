import { Insertable, Selectable } from 'kysely'
import { Cache as CacheEntity } from '../kysely/generated/types'

export interface Cache {
  key: string
  value: string
  chainId: number
  blockNumber: number | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<CacheEntity>): Cache {
  return row
}

export function toRow(record: Cache): Insertable<CacheEntity> {
  return record
}
