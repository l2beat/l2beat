import { Insertable, Selectable } from 'kysely'
import { AssetRisksUser } from '../../kysely/generated/types'

export interface AssetRisksUserRecord {
  id: string
  address: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(
  entity: Selectable<AssetRisksUser>,
): AssetRisksUserRecord {
  return entity
}

export function toRow(
  record: Omit<AssetRisksUserRecord, 'updatedAt'>,
): Insertable<AssetRisksUser> {
  return {
    ...record,
    updatedAt: new Date(),
  }
}
