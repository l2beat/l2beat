import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Blob } from '../kysely/generated/types'

export interface BlobRecord {
  id: number
  blockNumber: number
  timestamp: UnixTime
  daLayer: string
  from: string
  to: string | null
  topics: string[] | null
  size: bigint | null
}

export function toRecord(row: Selectable<Blob>): BlobRecord {
  return {
    id: row.id,
    blockNumber: row.blockNumber,
    timestamp: UnixTime.fromDate(row.timestamp),
    daLayer: numberToDaLayer(row.daLayer),
    from: row.from,
    to: row.to ?? null,
    topics: row.topics ? JSON.parse(row.topics) : null,
    size: row.size ? BigInt(row.size) : null,
  }
}

export function toRow(record: Omit<BlobRecord, 'id'>): Insertable<Blob> {
  return {
    blockNumber: record.blockNumber,
    timestamp: UnixTime.toDate(record.timestamp),
    daLayer: daLayerToNumber(record.daLayer),
    from: record.from,
    to: record.to ?? null,
    topics: record.topics ? JSON.stringify(record.topics) : null,
    size: record.size ? record.size.toString() : null,
  }
}

export function daLayerToNumber(daLayer: string): number {
  switch (daLayer) {
    case 'ethereum':
      return 0
    case 'avail':
      return 1
    case 'celestia':
      return 2
    case 'eigen-da':
      return 3
    default:
      throw new Error(`Unknown daLayer: ${daLayer}`)
  }
}

export function numberToDaLayer(daLayer: number): string {
  switch (daLayer) {
    case 0:
      return 'ethereum'
    case 1:
      return 'avail'
    case 2:
      return 'celestia'
    case 3:
      return 'eigen-da'
    default:
      throw new Error(`Unknown daLayer number: ${daLayer}`)
  }
}

export class BlobsRepository extends BaseRepository {
  async insertMany(records: Omit<BlobRecord, 'id'>[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('Blob').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BlobRecord[]> {
    const rows = await this.db.selectFrom('Blob').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByBlockRangeInclusive(
    daLayer: string,
    from: number,
    to: number,
  ): Promise<BlobRecord[]> {
    const rows = await this.db
      .selectFrom('Blob')
      .selectAll()
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Blob').executeTakeFirst()

    const resetIdQuery =
      sql`ALTER SEQUENCE public."Blob_id_seq" RESTART WITH 1`.compile(this.db)
    await this.db.executeQuery(resetIdQuery)

    return Number(result.numDeletedRows)
  }

  async deleteAfter(daLayer: string, blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('Blob')
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
