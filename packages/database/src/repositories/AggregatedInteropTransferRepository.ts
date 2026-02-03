import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropTransfer } from '../kysely/generated/types'

export interface AggregatedInteropTransferRecord {
  timestamp: UnixTime
  id: string
  bridgeType: 'lockAndMint' | 'omnichain' | 'nonMinting'
  srcChain: string
  dstChain: string
  transferCount: number
  identifiedCount: number
  totalDurationSum: number
  srcValueUsd: number | undefined
  dstValueUsd: number | undefined
  avgValueInFlight: number | undefined
  countUnder100: number
  count100To1K: number
  count1KTo10K: number
  count10KTo100K: number
  countOver100K: number
}

export function toRecord(
  row: Selectable<AggregatedInteropTransfer>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as 'lockAndMint' | 'omnichain' | 'nonMinting',
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    transferCount: row.transferCount,
    identifiedCount: row.identifiedCount,
    totalDurationSum: row.totalDurationSum,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
    avgValueInFlight: row.avgValueInFlight ?? undefined,
    countUnder100: row.countUnder100 ?? 0,
    count100To1K: row.count100To1K ?? 0,
    count1KTo10K: row.count1KTo10K ?? 0,
    count10KTo100K: row.count10KTo100K ?? 0,
    countOver100K: row.countOver100K ?? 0,
  }
}

export function toRow(
  record: AggregatedInteropTransferRecord,
): Insertable<AggregatedInteropTransfer> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    bridgeType: record.bridgeType,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    transferCount: record.transferCount,
    identifiedCount: record.identifiedCount,
    totalDurationSum: record.totalDurationSum,
    srcValueUsd: record.srcValueUsd,
    dstValueUsd: record.dstValueUsd,
    avgValueInFlight: record.avgValueInFlight,
    countUnder100: record.countUnder100,
    count100To1K: record.count100To1K,
    count1KTo10K: record.count1KTo10K,
    count10KTo100K: record.count10KTo100K,
    countOver100K: record.countOver100K,
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

  async getLatestTimestamp() {
    const result = await this.db
      .selectFrom('AggregatedInteropTransfer')
      .select((eb) => eb.fn.max('timestamp').as('max_timestamp'))
      .executeTakeFirst()
    return result ? UnixTime.fromDate(result.max_timestamp) : undefined
  }

  async getByChainsTimestampAndId(
    timestamp: UnixTime,
    srcChains: string[],
    dstChains: string[],
    type?: InteropBridgeType,
  ): Promise<AggregatedInteropTransferRecord[]> {
    if (srcChains.length === 0 || dstChains.length === 0) {
      return []
    }

    let query = this.db
      .selectFrom('AggregatedInteropTransfer')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', srcChains)
      .where('dstChain', 'in', dstChains)

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }
}
