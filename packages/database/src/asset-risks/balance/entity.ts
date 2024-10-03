import { Insertable, Selectable } from 'kysely'
import { AssetRisksBalance } from '../../kysely/generated/types'

export interface AssetRisksBalanceRecord {
  id: string
  userId: string
  tokenId: string
  balance: number
  updatedAt: Date
  createdAt: Date
}

export function toRecord(
  entity: Selectable<AssetRisksBalance>,
): AssetRisksBalanceRecord {
  return entity
}

export function toRow(
  record: Omit<AssetRisksBalanceRecord, 'updatedAt'>,
): Insertable<AssetRisksBalance> {
  return {
    ...record,
    updatedAt: new Date(),
  }
}
