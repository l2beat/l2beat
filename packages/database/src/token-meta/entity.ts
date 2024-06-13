import { Insertable, Selectable } from 'kysely'
import { TokenMeta as TokenMetaEntity } from '../kysely/generated/types'

export interface TokenMeta {
  id: string
  tokenId: string
  externalId: string | null
  source: string
  name: string | null
  symbol: string | null
  decimals: number | null
  logoUrl: string | null
  contractName: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<TokenMetaEntity>): TokenMeta {
  return row
}

export function toRow(record: TokenMeta): Insertable<TokenMetaEntity> {
  return record
}
