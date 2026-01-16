import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropTransfer } from '../kysely/generated/types'

export interface AggregatedInteropTransferRecord {
  timestamp: UnixTime
  id: string
  srcChain: string
  dstChain: string
  tokensByVolume: Record<string, number>
  transferCount: number
  totalDurationSum: number
  srcValueUsd: number | undefined
  dstValueUsd: number | undefined
}

export function toRecord(
  row: Selectable<AggregatedInteropTransfer>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    tokensByVolume: row.tokensByVolume as Record<string, number>,
    transferCount: row.transferCount,
    totalDurationSum: row.totalDurationSum,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
  }
}

export function toRow(
  record: AggregatedInteropTransferRecord,
): Insertable<AggregatedInteropTransfer> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    tokensByVolume: JSON.stringify(record.tokensByVolume),
    transferCount: record.transferCount,
    totalDurationSum: record.totalDurationSum,
    srcValueUsd: record.srcValueUsd,
    dstValueUsd: record.dstValueUsd,
  }
}

export class AggregatedInteropTransferRepository extends BaseRepository {
  async insertMany(
    records: AggregatedInteropTransferRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedInteropTransfer')
        .values(batch)
        .execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropTransferRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropTransfer')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropTransfer')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropTransfer')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTransfer')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTransfer')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
