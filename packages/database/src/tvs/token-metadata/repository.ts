import { BaseRepository } from '../../BaseRepository'
import { type TokenMetadataRecord, toRecord, toRow } from './entity'

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
