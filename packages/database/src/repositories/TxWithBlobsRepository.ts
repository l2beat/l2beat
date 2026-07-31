import type { EthereumBlobLog } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TxWithBlobs } from '../kysely/generated/types'

/** One blob-carrying transaction; blobCount holds the blob multiplicity. */
export interface TxWithBlobsRecord {
  id: number
  blockNumber: number
  timestamp: UnixTime
  daLayer: string
  from: string
  to: string | null
  /** Null for rows backfilled from the legacy per-blob table. */
  txHash: string | null
  blobCount: number
  /** Null for rows backfilled from the legacy per-blob table. */
  logs: EthereumBlobLog[] | null
  /** Legacy topic list; only set on backfilled rows, null on new writes. */
  topics: string[] | null
}

export interface BlobPairCount {
  from: string
  to: string | null
  count: number
}

export function toRecord(row: Selectable<TxWithBlobs>): TxWithBlobsRecord {
  return {
    id: row.id,
    blockNumber: row.blockNumber,
    timestamp: UnixTime.fromDate(row.timestamp),
    daLayer: numberToDaLayer(row.daLayer),
    from: row.from,
    to: row.to ?? null,
    txHash: row.txHash ?? null,
    blobCount: row.blobCount,
    logs: row.logs as EthereumBlobLog[] | null,
    topics: row.topics ? JSON.parse(row.topics) : null,
  }
}

export function toRow(
  record: Omit<TxWithBlobsRecord, 'id'>,
): Insertable<TxWithBlobs> {
  return {
    blockNumber: record.blockNumber,
    timestamp: UnixTime.toDate(record.timestamp),
    daLayer: daLayerToNumber(record.daLayer),
    from: record.from,
    to: record.to ?? null,
    txHash: record.txHash ?? null,
    blobCount: record.blobCount,
    logs: record.logs !== null ? JSON.stringify(record.logs) : null,
    topics: record.topics ? JSON.stringify(record.topics) : null,
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

export class TxWithBlobsRepository extends BaseRepository {
  async insertMany(records: Omit<TxWithBlobsRecord, 'id'>[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('TxWithBlobs').values(batch).execute()
    })
    return rows.length
  }

  async getCountPerAddressInbox(
    daLayer: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<BlobPairCount[]> {
    const rows = await this.db
      .selectFrom('TxWithBlobs')
      .select(['from', 'to'])
      .select((eb) => eb.fn.sum<number>('blobCount').as('count'))
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<', UnixTime.toDate(to))
      .groupBy(['from', 'to'])
      .execute()

    return rows.map((r) => ({
      from: r.from,
      to: r.to ?? null,
      count: Number(r.count),
    }))
  }

  async getAll(): Promise<TxWithBlobsRecord[]> {
    const rows = await this.db.selectFrom('TxWithBlobs').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByBlockRangeInclusive(
    daLayer: string,
    from: number,
    to: number,
  ): Promise<TxWithBlobsRecord[]> {
    const rows = await this.db
      .selectFrom('TxWithBlobs')
      .selectAll()
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .orderBy('blockNumber', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TxWithBlobs').executeTakeFirst()

    const resetIdQuery =
      sql`ALTER SEQUENCE public."TxWithBlobs_id_seq" RESTART WITH 1`.compile(
        this.db,
      )
    await this.db.executeQuery(resetIdQuery)

    return Number(result.numDeletedRows)
  }

  async deleteAfter(daLayer: string, blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('TxWithBlobs')
      .where('daLayer', '=', daLayerToNumber(daLayer))
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
