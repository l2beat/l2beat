import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropTransferToken } from '../kysely/generated/types'

export interface AggregatedInteropTransferTokenRecord {
  timestamp: UnixTime
  id: string
  srcChain: string
  dstChain: string
  abstractTokenId: string
  transferCount: number
  totalDurationSum: number
  volume: number
}

export function toRecord(
  row: Selectable<AggregatedInteropTransferToken>,
): AggregatedInteropTransferTokenRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    abstractTokenId: row.abstractTokenId,
    transferCount: row.transferCount,
    totalDurationSum: row.totalDurationSum,
    volume: row.volume,
  }
}

export function toRow(
  record: AggregatedInteropTransferTokenRecord,
): Insertable<AggregatedInteropTransferToken> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    abstractTokenId: record.abstractTokenId,
    transferCount: record.transferCount,
    totalDurationSum: record.totalDurationSum,
    volume: record.volume,
  }
}

export class AggregatedInteropTransferTokenRepository extends BaseRepository {
  async insertMany(
    records: AggregatedInteropTransferTokenRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedInteropTransferToken')
        .values(batch)
        .execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropTransferTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropTransferToken')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropTransferToken')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropTransferToken')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTransferToken')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTransferToken')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
