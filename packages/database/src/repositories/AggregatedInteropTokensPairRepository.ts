import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropTokensPair } from '../kysely/generated/types'
import type { InteropTransferTypeStatsMap } from './InteropTransferTypeStats'

export interface AggregatedInteropTokensPairRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  tokenA: string
  tokenB: string
  transferTypeStats: InteropTransferTypeStatsMap | undefined
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  volume: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
}

export function toRecord(
  row: Selectable<AggregatedInteropTokensPair>,
): AggregatedInteropTokensPairRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as InteropBridgeType,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    tokenA: row.tokenA,
    tokenB: row.tokenB,
    transferTypeStats:
      (row.transferTypeStats as InteropTransferTypeStatsMap | null) ??
      undefined,
    transferCount: row.transferCount,
    transfersWithDurationCount: row.transfersWithDurationCount,
    totalDurationSum: row.totalDurationSum,
    volume: row.volume,
    minTransferValueUsd: row.minTransferValueUsd ?? undefined,
    maxTransferValueUsd: row.maxTransferValueUsd ?? undefined,
  }
}

export function toRow(
  record: AggregatedInteropTokensPairRecord,
): Insertable<AggregatedInteropTokensPair> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    bridgeType: record.bridgeType,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    tokenA: record.tokenA,
    tokenB: record.tokenB,
    transferTypeStats: record.transferTypeStats,
    transferCount: record.transferCount,
    transfersWithDurationCount: record.transfersWithDurationCount,
    totalDurationSum: record.totalDurationSum,
    volume: record.volume,
    minTransferValueUsd: record.minTransferValueUsd,
    maxTransferValueUsd: record.maxTransferValueUsd,
  }
}

export class AggregatedInteropTokensPairRepository extends BaseRepository {
  async insertMany(
    records: AggregatedInteropTokensPairRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedInteropTokensPair')
        .values(batch)
        .execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropTokensPairRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropTokensPair')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByChainsIdAndTimestamp(
    timestamp: UnixTime,
    sourceChains: string[],
    destinationChains: string[],
    id?: string,
    type?: InteropBridgeType,
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTokensPairRecord[]> {
    if (sourceChains.length === 0 || destinationChains.length === 0) {
      return []
    }

    let query = this.db
      .selectFrom('AggregatedInteropTokensPair')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', sourceChains)
      .where('dstChain', 'in', destinationChains)

    if (id) {
      query = query.where('id', '=', id)
    }

    if (!options?.includeSameChainTransfers) {
      query = query.whereRef('srcChain', '!=', 'dstChain')
    }

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropTokensPair')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropTokensPair')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTokensPair')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropTokensPair')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
