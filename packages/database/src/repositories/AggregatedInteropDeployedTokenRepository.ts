import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropDeployedToken } from '../kysely/generated/types'
import type { InteropTransferTypeStatsMap } from './InteropTransferTypeStats'

export interface AggregatedInteropDeployedTokenRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  tokenChain: string
  tokenAddress: string
  transferTypeStats: InteropTransferTypeStatsMap | undefined
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  volume: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

export function toRecord(
  row: Selectable<AggregatedInteropDeployedToken>,
): AggregatedInteropDeployedTokenRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as InteropBridgeType,
    srcChain: row.srcChain,
    dstChain: row.dstChain,
    tokenChain: row.tokenChain,
    tokenAddress: row.tokenAddress,
    transferTypeStats:
      (row.transferTypeStats as InteropTransferTypeStatsMap | null) ??
      undefined,
    transferCount: row.transferCount,
    transfersWithDurationCount: row.transfersWithDurationCount,
    totalDurationSum: row.totalDurationSum,
    volume: row.volume,
    minTransferValueUsd: row.minTransferValueUsd ?? undefined,
    maxTransferValueUsd: row.maxTransferValueUsd ?? undefined,
    mintedValueUsd: row.mintedValueUsd ?? undefined,
    burnedValueUsd: row.burnedValueUsd ?? undefined,
  }
}

export function toRow(
  record: AggregatedInteropDeployedTokenRecord,
): Insertable<AggregatedInteropDeployedToken> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    bridgeType: record.bridgeType,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    tokenChain: record.tokenChain,
    tokenAddress: record.tokenAddress,
    transferTypeStats: record.transferTypeStats,
    transferCount: record.transferCount,
    transfersWithDurationCount: record.transfersWithDurationCount,
    totalDurationSum: record.totalDurationSum,
    volume: record.volume,
    minTransferValueUsd: record.minTransferValueUsd,
    maxTransferValueUsd: record.maxTransferValueUsd,
    mintedValueUsd: record.mintedValueUsd,
    burnedValueUsd: record.burnedValueUsd,
  }
}

export class AggregatedInteropDeployedTokenRepository extends BaseRepository {
  async insertMany(
    records: AggregatedInteropDeployedTokenRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedInteropDeployedToken')
        .values(batch)
        .execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropDeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropDeployedToken')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByTimestamp(
    timestamp: UnixTime,
  ): Promise<AggregatedInteropDeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropDeployedToken')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .execute()

    return rows.map(toRecord)
  }

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropDeployedToken')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropDeployedToken')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropDeployedToken')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropDeployedToken')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
