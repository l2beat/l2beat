import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { AssetRisksBalance } from '../../kysely/generated/types'

export interface AssetRisksBalanceRecord {
  id: string
  userId: string
  tokenId: string
  balance: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableAssetRisksBalanceRecord = Omit<
  Insertable<AssetRisksBalance>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRecord(
  record: UpsertableAssetRisksBalanceRecord,
): Insertable<AssetRisksBalance> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
