import { sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { type BlobRecord, daLayerToNumber, toRecord, toRow } from './entity'
import { selectBlob } from './select'

export class BlobsRepository extends BaseRepository {
  async insertMany(records: Omit<BlobRecord, 'id'>[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('Blob').values(batch).execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Blob').executeTakeFirst()

    const resetIdQuuery =
      sql`ALTER SEQUENCE public."Blob_id_seq" RESTART WITH 1`.compile(this.db)
    await this.db.executeQuery(resetIdQuuery)

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<BlobRecord[]> {
    const rows = await this.db.selectFrom('Blob').select(selectBlob).execute()

    return rows.map(toRecord)
  }

  async getByBlockRangeInclusive(
    daLayer: string,
    from: number,
    to: number,
  ): Promise<BlobRecord[]> {
    const rows = await this.db
      .selectFrom('Blob')
      .select(selectBlob)
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .execute()
    return rows.map(toRecord)
  }
}
