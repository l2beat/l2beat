import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropToken } from '../kysely/generated/types'
import type { InteropTransferTypeStatsMap } from './InteropTransferTypeStats'

export interface AggregatedInteropTokenRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  abstractTokenId: string
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

export interface AggregatedInteropTokenVolumeIncreaseRecord {
  timestamp: UnixTime
  abstractTokenId: string
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

export function toRecord(
  row: Selectable<AggregatedInteropToken>,
): AggregatedInteropTokenRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as InteropBridgeType,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    abstractTokenId: row.abstractTokenId,
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
  record: AggregatedInteropTokenRecord,
): Insertable<AggregatedInteropToken> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    bridgeType: record.bridgeType,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    abstractTokenId: record.abstractTokenId,
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

export class AggregatedInteropTokenRepository extends BaseRepository {
  async insertMany(records: AggregatedInteropTokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('AggregatedInteropToken').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByChainsAndTimestamp(
    timestamp: UnixTime,
    sourceChains: string[],
    destinationChains: string[],
    type?: InteropBridgeType,
    protocolIds?: string[],
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTokenRecord[]> {
    if (
      sourceChains.length === 0 ||
      destinationChains.length === 0 ||
      protocolIds?.length === 0
    ) {
      return []
    }

    let query = this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', sourceChains)
      .where('dstChain', 'in', destinationChains)

    if (protocolIds) {
      query = query.where('id', 'in', protocolIds)
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

  async getByChainsIdAndTimestamp(
    timestamp: UnixTime,
    id: string,
    sourceChains: string[],
    destinationChains: string[],
    type?: InteropBridgeType,
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTokenRecord[]> {
    if (sourceChains.length === 0 || destinationChains.length === 0) {
      return []
    }

    let query = this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', sourceChains)
      .where('dstChain', 'in', destinationChains)
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

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropToken')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropToken')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropToken')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropToken')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getLargestTokenVolumeIncrease(
    timestamp: UnixTime,
    previousTimestamp: UnixTime,
  ): Promise<AggregatedInteropTokenVolumeIncreaseRecord | undefined> {
    const current = this.db
      .selectFrom('AggregatedInteropToken as a')
      .select([
        sql<string>`"a"."abstractTokenId"`.as('abstract_token_id'),
        sql<number>`sum("a"."volume")`.as('volume_usd'),
      ])
      .where('a.timestamp', '=', UnixTime.toDate(timestamp))
      .whereRef('a.srcChain', '!=', 'a.dstChain')
      .groupBy('a.abstractTokenId')
      .as('current')

    const previous = this.db
      .selectFrom('AggregatedInteropToken as a')
      .select([
        sql<string>`"a"."abstractTokenId"`.as('abstract_token_id'),
        sql<number>`sum("a"."volume")`.as('volume_usd'),
      ])
      .where('a.timestamp', '=', UnixTime.toDate(previousTimestamp))
      .whereRef('a.srcChain', '!=', 'a.dstChain')
      .groupBy('a.abstractTokenId')
      .as('previous')

    const increaseUsd = sql<number>`
      "current"."volume_usd" - coalesce("previous"."volume_usd", 0)
    `

    const row = await this.db
      .selectFrom(current)
      .leftJoin(previous, (join) =>
        join.onRef(
          'current.abstract_token_id',
          '=',
          'previous.abstract_token_id',
        ),
      )
      .select([
        'current.abstract_token_id as abstract_token_id',
        sql<number>`"current"."volume_usd"`.as('current_volume_usd'),
        sql<number>`coalesce("previous"."volume_usd", 0)`.as(
          'previous_volume_usd',
        ),
        increaseUsd.as('increase_usd'),
      ])
      .where(increaseUsd, '>', 0)
      .orderBy(sql`increase_usd desc`)
      .orderBy('current.abstract_token_id', 'asc')
      .limit(1)
      .executeTakeFirst()

    if (!row) {
      return undefined
    }

    return {
      timestamp,
      abstractTokenId: row.abstract_token_id,
      currentVolumeUsd: Number(row.current_volume_usd ?? 0),
      previousVolumeUsd: Number(row.previous_volume_usd ?? 0),
      increaseUsd: Number(row.increase_usd ?? 0),
    }
  }
}
