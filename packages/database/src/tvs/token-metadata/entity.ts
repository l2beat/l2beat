import type { Insertable, Selectable } from 'kysely'
import type { TokenMetadata } from '../../kysely/generated/types'

type TokenCategory =
  | 'ether'
  | 'stablecoin'
  | 'btc'
  | 'rwaRestricted'
  | 'rwaPublic'
  | 'other'

type TokenSource = 'canonical' | 'external' | 'native'

export interface TokenMetadataRecord {
  projectId: string
  tokenId: string
  source: TokenSource
  category: TokenCategory
  isAssociated: boolean
}

export function toRecord(row: Selectable<TokenMetadata>): TokenMetadataRecord {
  return {
    projectId: row.projectId,
    tokenId: row.tokenId,
    source: row.source as TokenSource,
    category: row.category as TokenCategory,
    isAssociated: row.isAssociated,
  }
}

export function toRow(record: TokenMetadataRecord): Insertable<TokenMetadata> {
  return record
}
