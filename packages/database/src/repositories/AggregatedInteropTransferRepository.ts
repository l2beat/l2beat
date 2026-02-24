import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropTransfer } from '../kysely/generated/types'

export interface AggregatedInteropTransferRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  transferCount: number
  identifiedCount: number
  totalDurationSum: number
  srcValueUsd: number | undefined
  dstValueUsd: number | undefined
  avgValueInFlight: number | undefined
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
  countUnder100: number
  count100To1K: number
  count1KTo10K: number
  count10KTo100K: number
  countOver100K: number
}

export interface AggregatedInteropTransferSeriesRecord {
  day: UnixTime
  id: string
  transferCount: number
}

export interface AggregatedInteropTransferIdSeriesRecord {
  timestamp: UnixTime
  id: string
  transferCount: number
  totalDurationSum: number
  totalSrcValueUsd: number
  totalDstValueUsd: number
}

export function toRecord(
  row: Selectable<AggregatedInteropTransfer>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as InteropBridgeType,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    transferCount: row.transferCount,
    identifiedCount: row.identifiedCount,
    totalDurationSum: row.totalDurationSum,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
    avgValueInFlight: row.avgValueInFlight ?? undefined,
    mintedValueUsd: row.mintedValueUsd ?? undefined,
    burnedValueUsd: row.burnedValueUsd ?? undefined,
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
    mintedValueUsd: record.mintedValueUsd,
    burnedValueUsd: record.burnedValueUsd,
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

  async getDailySeries(): Promise<AggregatedInteropTransferSeriesRecord[]> {
    const rows = await this.db
      .with('latest_per_day', (db) =>
        db
          .selectFrom('AggregatedInteropTransfer')
          .select((eb) => [
            sql<Date>`date_trunc('day', timestamp)`.as('day'),
            'id',
            eb.fn.max('timestamp').as('latest_ts'),
          ])
          .groupBy(['id', sql`date_trunc('day', timestamp)`]),
      )
      .selectFrom('AggregatedInteropTransfer')
      .innerJoin('latest_per_day', (join) =>
        join
          .onRef('AggregatedInteropTransfer.id', '=', 'latest_per_day.id')
          .on(
            sql`date_trunc('day', "AggregatedInteropTransfer"."timestamp")`,
            '=',
            sql`"latest_per_day"."day"`,
          )
          .onRef(
            'AggregatedInteropTransfer.timestamp',
            '=',
            'latest_per_day.latest_ts',
          ),
      )
      .select((eb) => [
        sql<Date>`"latest_per_day"."day"`.as('day'),
        sql<string>`"latest_per_day"."id"`.as('id'),
        eb.fn.sum('transferCount').as('transfer_count'),
      ])
      .groupBy(['latest_per_day.day', 'latest_per_day.id'])
      .orderBy('latest_per_day.id', 'asc')
      .orderBy('latest_per_day.day', 'asc')
      .execute()

    return rows.map((row) => ({
      day: UnixTime.fromDate(row.day),
      id: row.id,
      transferCount: Number(row.transfer_count ?? 0),
    }))
  }

  async getDailySeriesById(
    id: string,
  ): Promise<AggregatedInteropTransferIdSeriesRecord[]> {
    const rows = await this.db
      .with('latest_per_day', (db) =>
        db
          .selectFrom('AggregatedInteropTransfer')
          .select((eb) => [
            sql<Date>`date_trunc('day', timestamp)`.as('day'),
            'id',
            eb.fn.max('timestamp').as('latest_ts'),
          ])
          .where('id', '=', id)
          .groupBy(['id', sql`date_trunc('day', timestamp)`]),
      )
      .selectFrom('AggregatedInteropTransfer')
      .innerJoin('latest_per_day', (join) =>
        join
          .onRef('AggregatedInteropTransfer.id', '=', 'latest_per_day.id')
          .on(
            sql`date_trunc('day', "AggregatedInteropTransfer"."timestamp")`,
            '=',
            sql`"latest_per_day"."day"`,
          )
          .onRef(
            'AggregatedInteropTransfer.timestamp',
            '=',
            'latest_per_day.latest_ts',
          ),
      )
      .select((eb) => [
        sql<string>`"latest_per_day"."id"`.as('id'),
        sql<Date>`"latest_per_day"."day"`.as('day'),
        eb.fn.sum('transferCount').as('transfer_count'),
        eb.fn.sum('totalDurationSum').as('total_duration_sum'),
        eb.fn.sum('srcValueUsd').as('total_src_value_usd'),
        eb.fn.sum('dstValueUsd').as('total_dst_value_usd'),
      ])
      .groupBy(['latest_per_day.day', 'latest_per_day.id'])
      .orderBy('latest_per_day.day', 'asc')
      .execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.day),
      id: row.id,
      transferCount: Number(row.transfer_count ?? 0),
      totalDurationSum: Number(row.total_duration_sum ?? 0),
      totalSrcValueUsd: Number(row.total_src_value_usd ?? 0),
      totalDstValueUsd: Number(row.total_dst_value_usd ?? 0),
    }))
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
    return result?.max_timestamp
      ? UnixTime.fromDate(result.max_timestamp)
      : undefined
  }

  async getByChainsAndTimestamp(
    timestamp: UnixTime,
    selectedChains: [string, string],
    type?: InteropBridgeType,
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTransferRecord[]> {
    let query = this.db
      .selectFrom('AggregatedInteropTransfer')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', selectedChains)
      .where('dstChain', 'in', selectedChains)

    if (!options?.includeSameChainTransfers) {
      query = query.whereRef('srcChain', '!=', 'dstChain')
    }

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getSummedTransferCountsByChainsIdAndTimestamp(
    timestamp: UnixTime,
    id: string,
    selectedChains: [string, string],
    type?: InteropBridgeType,
    options?: {
      includeSameChainTransfers?: boolean
    },
  ) {
    let query = this.db
      .selectFrom('AggregatedInteropTransfer')
      .select((eb) => eb.fn.sum('transferCount').as('transferCountSum'))
      .select((eb) => eb.fn.sum('identifiedCount').as('identifiedCountSum'))
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', selectedChains)
      .where('dstChain', 'in', selectedChains)
      .where('id', '=', id)

    if (!options?.includeSameChainTransfers) {
      query = query.whereRef('srcChain', '!=', 'dstChain')
    }

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const result = await query.executeTakeFirst()
    if (!result) {
      return {
        transferCount: 0,
        identifiedCount: 0,
      }
    }
    return {
      transferCount: Number(result.transferCountSum),
      identifiedCount: Number(result.identifiedCountSum),
    }
  }

  async getByChainsIdAndTimestamp(
    timestamp: UnixTime,
    id: string,
    selectedChains: [string, string],
    type?: InteropBridgeType,
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTransferRecord[]> {
    let query = this.db
      .selectFrom('AggregatedInteropTransfer')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', selectedChains)
      .where('dstChain', 'in', selectedChains)
      .where('id', '=', id)

    if (!options?.includeSameChainTransfers) {
      query = query.whereRef('srcChain', '!=', 'dstChain')
    }

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }
}
