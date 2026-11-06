import { UnixTime } from '@l2beat/shared-pure'
import { type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { BlobFeeHourly } from '../kysely/generated/types'

/** The blocks of one hour, by their BlobFee rows */
export interface BlobFeeHourlyRecord {
  timestamp: UnixTime
  blocks: number
  /** Wei per blob gas, averaged over the blocks */
  avgBlobBaseFee: bigint
  /** Wei per blob gas */
  maxBlobBaseFee: bigint
  /** Wei per gas, averaged over the blocks */
  avgBaseFeePerGas: bigint
}

export function toRecord(row: Selectable<BlobFeeHourly>): BlobFeeHourlyRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    blocks: row.blocks,
    avgBlobBaseFee: BigInt(row.avgBlobBaseFee),
    maxBlobBaseFee: BigInt(row.maxBlobBaseFee),
    avgBaseFeePerGas: BigInt(row.avgBaseFeePerGas),
  }
}

export class BlobFeeHourlyRepository extends BaseRepository {
  /**
   * Replaces every hour from `fromHour` on with what BlobFee holds now, in
   * SQL: the hours a batch of blocks touches are few, and recomputing them
   * whole keeps a block written twice, or deleted, from being counted twice
   */
  async recomputeFrom(fromHour: UnixTime): Promise<void> {
    const from = UnixTime.toDate(UnixTime.toStartOf(fromHour, 'hour'))
    await this.transaction(async () => {
      await this.db
        .deleteFrom('BlobFeeHourly')
        .where('timestamp', '>=', from)
        .execute()
      await sql`
        INSERT INTO "BlobFeeHourly"
          ("timestamp", "blocks", "avgBlobBaseFee", "maxBlobBaseFee", "avgBaseFeePerGas")
        SELECT
          date_trunc('hour', "timestamp"),
          count(*),
          floor(avg("blobBaseFee"))::bigint,
          max("blobBaseFee"),
          floor(avg("baseFeePerGas"))::bigint
        FROM "BlobFee"
        WHERE "timestamp" >= ${from}
        GROUP BY 1
      `.execute(this.db)
    })
  }

  /** From `from` included to `to` excluded */
  async getByTimeRange(
    from: UnixTime,
    to: UnixTime,
  ): Promise<BlobFeeHourlyRecord[]> {
    const rows = await this.db
      .selectFrom('BlobFeeHourly')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getAll(): Promise<BlobFeeHourlyRecord[]> {
    const rows = await this.db
      .selectFrom('BlobFeeHourly')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BlobFeeHourly').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
