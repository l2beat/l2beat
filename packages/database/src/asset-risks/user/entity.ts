import { Insertable } from 'kysely'
import { AssetRisksUser } from '../../kysely/generated/types'
import { nanoid } from 'nanoid'

export interface AssetRisksUserRecord {
  id: string
  address: string
  tokensRefreshedAt: Date | null
  balancesRefreshedAt: Date | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableAssetRisksUserRecord = Omit<
  Insertable<AssetRisksUser>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRecord(
  record: UpsertableAssetRisksUserRecord,
): Insertable<AssetRisksUser> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
