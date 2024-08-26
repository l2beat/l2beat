import { Insertable, Selectable } from 'kysely'
import { TokenMeta } from '../../kysely/token-db/types'

export interface TokenMetaRecord {
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

export function toRecord(row: Selectable<TokenMeta>): TokenMetaRecord {
  return row
}

export function toRow(record: TokenMetaRecord): Insertable<TokenMeta> {
  return record
}
