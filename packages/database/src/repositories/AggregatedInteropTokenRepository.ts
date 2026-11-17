import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropToken } from '../kysely/generated/types'
import {
  type AggregatedInteropHistoryFilter,
  isEmptyFilter,
} from './AggregatedInteropHistoryFilter'
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

export interface AggregatedInteropProtocolVolumeRecord {
  timestamp: UnixTime
  id: string
  volume: number
}

export interface AggregatedInteropChainVolumeRecord {
  timestamp: UnixTime
  chain: string
  inflow: number
  outflow: number
}

export interface AggregatedInteropLaneVolumeRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  volume: number
}

export interface AggregatedInteropLaneCandidateRecord
  extends AggregatedInteropLaneVolumeRecord {
  /** The token with the most volume on the lane. */
  topAbstractTokenId: string
}

export interface AggregatedInteropTokenVolumeRecord {
  timestamp: UnixTime
  id: string
  abstractTokenId: string
  volume: number
}

export interface AggregatedInteropTokenLaneVolumeRecord
  extends AggregatedInteropLaneVolumeRecord {
  abstractTokenId: string
}

// `volume` is a real, and a sum of reals keeps only ~7 significant digits.
const volumeSum = sql<number>`sum("volume"::double precision)`

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
    types?: InteropBridgeType[],
    protocolIds?: string[],
    options?: {
      includeSameChainTransfers?: boolean
    },
  ): Promise<AggregatedInteropTokenRecord[]> {
    if (
      sourceChains.length === 0 ||
      destinationChains.length === 0 ||
      protocolIds?.length === 0 ||
      types?.length === 0
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

    if (types) {
      query = query.where('bridgeType', 'in', types)
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

  /**
   * Filters rows like `getByChainsAndTimestamp`, so that method returns the
   * token's rows for the snapshot found here.
   */
  async getLatestPromotedTimestampForToken(
    abstractTokenId: string,
    options: {
      upTo: UnixTime
      sourceChains: string[]
      destinationChains: string[]
    },
  ): Promise<UnixTime | undefined> {
    if (
      options.sourceChains.length === 0 ||
      options.destinationChains.length === 0
    ) {
      return undefined
    }

    const result = await this.db
      .selectFrom('AggregatedInteropToken as token')
      .innerJoin(
        'InteropAggregateStatus as status',
        'status.timestamp',
        'token.timestamp',
      )
      .select((eb) => eb.fn.max('token.timestamp').as('max_timestamp'))
      .where('status.status', '=', 'promoted')
      .where('token.abstractTokenId', '=', abstractTokenId)
      .where('token.timestamp', '<=', UnixTime.toDate(options.upTo))
      .where('token.srcChain', 'in', options.sourceChains)
      .where('token.dstChain', 'in', options.destinationChains)
      .whereRef('token.srcChain', '!=', 'token.dstChain')
      .where('token.transferCount', '>', 0)
      .executeTakeFirst()

    return result?.max_timestamp
      ? UnixTime.fromDate(result.max_timestamp)
      : undefined
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

  async getByTimestamp(
    timestamp: UnixTime,
  ): Promise<AggregatedInteropTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .execute()

    return rows.map(toRecord)
  }

  async getHistoryVolumeByProtocol(
    filter: AggregatedInteropHistoryFilter,
  ): Promise<AggregatedInteropProtocolVolumeRecord[]> {
    if (isEmptyFilter(filter)) return []

    const rows = await this.selectHistory(filter)
      .select(['timestamp', 'id', volumeSum.as('volume')])
      .groupBy(['timestamp', 'id'])
      .execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      id: row.id,
      volume: Number(row.volume),
    }))
  }

  async getHistoryVolumeByChain(
    filter: AggregatedInteropHistoryFilter,
  ): Promise<AggregatedInteropChainVolumeRecord[]> {
    if (isEmptyFilter(filter)) return []

    const [inflows, outflows] = await Promise.all([
      this.selectHistory(filter)
        .select(['timestamp', 'dstChain as chain', volumeSum.as('volume')])
        .groupBy(['timestamp', 'dstChain'])
        .execute(),
      this.selectHistory(filter)
        .select(['timestamp', 'srcChain as chain', volumeSum.as('volume')])
        .groupBy(['timestamp', 'srcChain'])
        .execute(),
    ])

    const records = new Map<string, AggregatedInteropChainVolumeRecord>()
    const get = (timestamp: Date, chain: string) => {
      const key = `${timestamp.getTime()}:${chain}`
      let record = records.get(key)
      if (!record) {
        record = {
          timestamp: UnixTime.fromDate(timestamp),
          chain,
          inflow: 0,
          outflow: 0,
        }
        records.set(key, record)
      }
      return record
    }
    for (const row of inflows) {
      get(row.timestamp, row.chain).inflow = Number(row.volume)
    }
    for (const row of outflows) {
      get(row.timestamp, row.chain).outflow = Number(row.volume)
    }
    return [...records.values()]
  }

  /** Lanes of any chains whose volume in a snapshot is above `minVolume`. */
  async getHistoryLanesAbove(
    timestamps: UnixTime[],
    minVolume: number,
  ): Promise<AggregatedInteropLaneCandidateRecord[]> {
    if (timestamps.length === 0) return []

    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .select([
        'timestamp',
        'id',
        'bridgeType',
        'srcChain',
        'dstChain',
        volumeSum.as('volume'),
        sql<string>`(array_agg("abstractTokenId" order by "volume" desc))[1]`.as(
          'top_token',
        ),
      ])
      .where('timestamp', 'in', timestamps.map(UnixTime.toDate))
      .whereRef('srcChain', '!=', 'dstChain')
      .groupBy(['timestamp', 'id', 'bridgeType', 'srcChain', 'dstChain'])
      .having(volumeSum, '>', minVolume)
      .execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      id: row.id,
      bridgeType: row.bridgeType as InteropBridgeType,
      srcChain: row.srcChain,
      dstChain: row.dstChain,
      volume: Number(row.volume),
      topAbstractTokenId: row.top_token,
    }))
  }

  /** A protocol's volume of a token, over all lanes, above `minVolume`. */
  async getHistoryTokensAbove(
    timestamps: UnixTime[],
    minVolume: number,
  ): Promise<AggregatedInteropTokenVolumeRecord[]> {
    if (timestamps.length === 0) return []

    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .select(['timestamp', 'id', 'abstractTokenId', volumeSum.as('volume')])
      .where('timestamp', 'in', timestamps.map(UnixTime.toDate))
      .whereRef('srcChain', '!=', 'dstChain')
      .groupBy(['timestamp', 'id', 'abstractTokenId'])
      .having(volumeSum, '>', minVolume)
      .execute()

    return rows.map(toTokenVolumeRecord)
  }

  async getHistoryTokenSeries(
    timestamps: UnixTime[],
    pairs: { id: string; abstractTokenId: string }[],
  ): Promise<AggregatedInteropTokenVolumeRecord[]> {
    if (timestamps.length === 0 || pairs.length === 0) return []

    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .select(['timestamp', 'id', 'abstractTokenId', volumeSum.as('volume')])
      .where('timestamp', 'in', timestamps.map(UnixTime.toDate))
      .whereRef('srcChain', '!=', 'dstChain')
      .where((eb) =>
        eb.or(
          pairs.map((pair) =>
            eb.and([
              eb('id', '=', pair.id),
              eb('abstractTokenId', '=', pair.abstractTokenId),
            ]),
          ),
        ),
      )
      .groupBy(['timestamp', 'id', 'abstractTokenId'])
      .execute()

    return rows.map(toTokenVolumeRecord)
  }

  async getHistoryTokenLanes(
    keys: { timestamp: UnixTime; id: string; abstractTokenId: string }[],
  ): Promise<AggregatedInteropTokenLaneVolumeRecord[]> {
    if (keys.length === 0) return []

    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .select([
        'timestamp',
        'id',
        'bridgeType',
        'srcChain',
        'dstChain',
        'abstractTokenId',
        volumeSum.as('volume'),
      ])
      .whereRef('srcChain', '!=', 'dstChain')
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('timestamp', '=', UnixTime.toDate(key.timestamp)),
              eb('id', '=', key.id),
              eb('abstractTokenId', '=', key.abstractTokenId),
            ]),
          ),
        ),
      )
      .groupBy([
        'timestamp',
        'id',
        'bridgeType',
        'srcChain',
        'dstChain',
        'abstractTokenId',
      ])
      .execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      id: row.id,
      bridgeType: row.bridgeType as InteropBridgeType,
      srcChain: row.srcChain,
      dstChain: row.dstChain,
      abstractTokenId: row.abstractTokenId,
      volume: Number(row.volume),
    }))
  }

  private selectHistory(filter: AggregatedInteropHistoryFilter) {
    let query = this.db
      .selectFrom('AggregatedInteropToken')
      .where('timestamp', 'in', filter.timestamps.map(UnixTime.toDate))
      .where('srcChain', 'in', filter.sourceChains)
      .where('dstChain', 'in', filter.destinationChains)
      .whereRef('srcChain', '!=', 'dstChain')
    if (filter.protocolIds) {
      query = query.where('id', 'in', filter.protocolIds)
    }
    return query
  }
}

function toTokenVolumeRecord(row: {
  timestamp: Date
  id: string
  abstractTokenId: string
  volume: number
}): AggregatedInteropTokenVolumeRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    abstractTokenId: row.abstractTokenId,
    volume: Number(row.volume),
  }
}
