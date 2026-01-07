import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenMetadata } from '../kysely/generated/types'

export type TokenCategory =
  | 'ether'
  | 'stablecoin'
  | 'btc'
  | 'rwaRestricted'
  | 'rwaPublic'
  | 'other'

export type TokenSource = 'canonical' | 'external' | 'native'

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

export class TokenMetadataRepository extends BaseRepository {
  async insertMany(records: TokenMetadataRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TokenMetadata').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<TokenMetadataRecord[]> {
    const rows = await this.db.selectFrom('TokenMetadata').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenMetadata').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
