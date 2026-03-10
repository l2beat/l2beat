import {
  assert,
  type InteropBridgeType,
  InteropBridgeTypeValues,
  type KnownInteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropTransfer } from '../kysely/generated/types'

// Interop bridge types are stored in the database.
// If they are modified (e.g. renamed/removed), you MUST update
// the data already in the DB via a new migration.
const EXPECTED_DB_INTEROP_BRIDGE_TYPES = [
  'lockAndMint',
  'nonMinting',
  'burnAndMint',
  'unknown',
] as const
const _interopBridgeTypesMustMatchDbContract: typeof EXPECTED_DB_INTEROP_BRIDGE_TYPES =
  InteropBridgeTypeValues

function isInteropBridgeType(value: string): value is InteropBridgeType {
  return (InteropBridgeTypeValues as readonly string[]).includes(value)
}

export type TransferFilter = 'excludeNonMinting' | 'onlyLiquidityBased'

export interface InteropTransferRecord {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  transferId: string
  type: string
  duration: number
  timestamp: UnixTime
  srcTime: UnixTime
  srcChain: string
  srcTxHash: string
  srcLogIndex: number
  srcEventId: string
  srcTokenAddress: string | undefined
  srcRawAmount: bigint | undefined
  srcWasBurned: boolean | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcPrice: number | undefined
  srcValueUsd: number | undefined
  dstTime: UnixTime
  dstChain: string
  dstTxHash: string
  dstLogIndex: number
  dstEventId: string
  dstTokenAddress: string | undefined
  dstRawAmount: bigint | undefined
  dstWasMinted: boolean | undefined
  dstAbstractTokenId: string | undefined
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstPrice: number | undefined
  dstValueUsd: number | undefined
  isProcessed: boolean
}

export interface InteropTransferUpdate {
  srcAbstractTokenId?: string | null
  srcSymbol?: string | null
  srcPrice?: number | null
  srcAmount?: number | null
  srcValueUsd?: number | null
  dstAbstractTokenId?: string | null
  dstSymbol?: string | null
  dstPrice?: number | null
  dstAmount?: number | null
  dstValueUsd?: number | null
}

export interface InteropMissingTokenInfo {
  chain: string
  tokenAddress: string
  count: number
  plugins: string[]
}

export function toRecord(
  row: Selectable<InteropTransfer>,
): InteropTransferRecord {
  if (row.bridgeType !== null && !isInteropBridgeType(row.bridgeType)) {
    throw new Error(
      `Invalid interop transfer bridge type: ${row.bridgeType} for transfer ${row.transferId}`,
    )
  }

  return {
    plugin: row.plugin,
    transferId: row.transferId,
    type: row.type,
    bridgeType:
      row.bridgeType === null
        ? undefined
        : (row.bridgeType as KnownInteropBridgeType),
    duration: row.duration,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: UnixTime.fromDate(row.srcTime),
    srcChain: row.srcChain,
    srcTxHash: row.srcTxHash,
    srcLogIndex: row.srcLogIndex,
    srcEventId: row.srcEventId,
    srcTokenAddress: row.srcTokenAddress ?? undefined,
    srcRawAmount: row.srcRawAmount ? BigInt(row.srcRawAmount) : undefined,
    srcWasBurned: row.srcWasBurned ?? undefined,
    srcAbstractTokenId: row.srcAbstractTokenId ?? undefined,
    srcSymbol: row.srcSymbol ?? undefined,
    srcAmount: row.srcAmount ?? undefined,
    srcPrice: row.srcPrice ?? undefined,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstTime: UnixTime.fromDate(row.dstTime),
    dstChain: row.dstChain,
    dstTxHash: row.dstTxHash,
    dstLogIndex: row.dstLogIndex,
    dstEventId: row.dstEventId,
    dstTokenAddress: row.dstTokenAddress ?? undefined,
    dstRawAmount: row.dstRawAmount ? BigInt(row.dstRawAmount) : undefined,
    dstWasMinted: row.dstWasMinted ?? undefined,
    dstAbstractTokenId: row.dstAbstractTokenId ?? undefined,
    dstSymbol: row.dstSymbol ?? undefined,
    dstAmount: row.dstAmount ?? undefined,
    dstPrice: row.dstPrice ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
    isProcessed: row.isProcessed,
  }
}

export function toRow(
  record: InteropTransferRecord,
): Insertable<InteropTransfer> {
  return {
    plugin: record.plugin,
    transferId: record.transferId,
    type: record.type,
    bridgeType: record.bridgeType,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime: UnixTime.toDate(record.srcTime),
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash?.toLowerCase(),
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    srcTokenAddress: record.srcTokenAddress,
    srcRawAmount: record.srcRawAmount?.toString(),
    srcWasBurned: record.srcWasBurned,
    srcAbstractTokenId: record.srcAbstractTokenId,
    srcSymbol: record.srcSymbol,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstTime: UnixTime.toDate(record.dstTime),
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash?.toLowerCase(),
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
    dstTokenAddress: record.dstTokenAddress,
    dstRawAmount: record.dstRawAmount?.toString(),
    dstWasMinted: record.dstWasMinted,
    dstAbstractTokenId: record.dstAbstractTokenId,
    dstSymbol: record.dstSymbol,
    dstAmount: record.dstAmount,
    dstPrice: record.dstPrice,
    dstValueUsd: record.dstValueUsd,
    isProcessed: record.isProcessed,
  }
}

export interface InteropTransfersStatsRecord {
  plugin: string
  type: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export interface InteropTransfersDetailedStatsRecord {
  plugin: string
  type: string
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export class InteropTransferRepository extends BaseRepository {
  async insertMany(records: InteropTransferRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('InteropTransfer').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<InteropTransferRecord[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByRange(
    from: UnixTime,
    to: UnixTime,
  ): Promise<InteropTransferRecord[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .where('timestamp', '>', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByType(
    type: string,
    options: {
      srcChain?: string
      dstChain?: string
    } = {},
  ): Promise<InteropTransferRecord[]> {
    let query = this.db.selectFrom('InteropTransfer').where('type', '=', type)

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getProjectTransfers(options: {
    plugins: string[]
    snapshotTimestamp: UnixTime
    sourceChains: string[]
    destinationChains: string[]
  }): Promise<InteropTransferRecord[]> {
    if (
      options.plugins.length === 0 ||
      options.sourceChains.length === 0 ||
      options.destinationChains.length === 0
    ) {
      return []
    }

    const from = options.snapshotTimestamp - UnixTime.DAY
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('timestamp', '>', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(options.snapshotTimestamp))
      .where('plugin', 'in', options.plugins)
      .where('srcChain', 'in', options.sourceChains)
      .where('dstChain', 'in', options.destinationChains)
      .whereRef('srcChain', '!=', 'dstChain')
      .orderBy('timestamp', 'desc')
      .orderBy('transferId', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async getUnprocessed() {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .where('isProcessed', '=', false)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async updateFinancials(
    id: string,
    update: InteropTransferUpdate,
  ): Promise<void> {
    await this.db
      .updateTable('InteropTransfer')
      .set({ ...update, isProcessed: true })
      .where('transferId', '=', id)
      .execute()
  }

  async markAllAsUnprocessed(): Promise<number> {
    const result = await this.db
      .updateTable('InteropTransfer')
      .set({ isProcessed: false })
      .where('isProcessed', '=', true)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getStats(): Promise<InteropTransfersStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'plugin',
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .groupBy(['plugin', 'type'])
      .execute()

    return overallStats.map((overall) => ({
      plugin: overall.plugin,
      type: overall.type,
      count: Number(overall.count),
      avgDuration: Number(overall.avgDuration),
      srcValueSum: Number(overall.srcValueSum),
      dstValueSum: Number(overall.dstValueSum),
    }))
  }

  async getDetailedStats(): Promise<InteropTransfersDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'plugin',
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .where('srcChain', 'is not', null)
      .where('dstChain', 'is not', null)
      .groupBy(['plugin', 'type', 'srcChain', 'dstChain'])
      .execute()

    return chainStats.map((chain) => {
      assert(chain.srcChain && chain.dstChain)
      return {
        plugin: chain.plugin,
        type: chain.type,
        srcChain: chain.srcChain,
        dstChain: chain.dstChain,
        count: Number(chain.count),
        avgDuration: Number(chain.avgDuration),
        srcValueSum: Number(chain.srcValueSum),
        dstValueSum: Number(chain.dstValueSum),
      }
    })
  }

  async getExistingItems(
    items: { srcTxHash: string; dstTxHash: string }[],
  ): Promise<InteropTransferRecord[]> {
    if (items.length === 0) return []

    const srcHashes = items.map((x) => x.srcTxHash.toLowerCase())
    const dstHashes = items.map((x) => x.dstTxHash.toLowerCase())
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('srcTxHash', 'in', srcHashes)
      .where('dstTxHash', 'in', dstHashes)
      .execute()
    return rows.map(toRecord)
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteForPlugin(plugin: string): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .where('plugin', '=', plugin)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getTransferSpeedStats(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        eb.fn.count('type').as('cnt'),
        sql<number>`ROUND(SUM("srcValueUsd")::numeric, 0)`.as('volume_usd'),
        sql<number>`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration)`.as(
          'p50_sec',
        ),
        sql<number>`PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration)`.as(
          'p95_sec',
        ),
        sql<number>`MIN(duration)`.as('min_sec'),
        sql<number>`MAX(duration)`.as('max_sec'),
        sql<number>`COUNT(DISTINCT "srcChain")`.as('src_chain_count'),
        sql<number>`COUNT(DISTINCT "dstChain")`.as('dst_chain_count'),
      ])
      .where('duration', '>', 0)
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    query = this.applyTransferFilter(query, filter)
    query = query.groupBy('type').orderBy('cnt', 'desc')

    const rows = await query.execute()

    // biome-ignore lint/suspicious/noExplicitAny: kysely query builder loses type after reassignment
    return rows.map((r: any) => ({
      type: r.type,
      count: Number(r.cnt ?? 0),
      volumeUsd: Number(r.volume_usd ?? 0),
      p50Sec: Number(r.p50_sec ?? 0),
      p95Sec: Number(r.p95_sec ?? 0),
      minSec: Number(r.min_sec ?? 0),
      maxSec: Number(r.max_sec ?? 0),
      srcChainCount: Number(r.src_chain_count ?? 0),
      dstChainCount: Number(r.dst_chain_count ?? 0),
    }))
  }

  async getChainCoverage(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let srcQuery = this.db
      .selectFrom('InteropTransfer')
      .select(['type', sql<string>`"srcChain"`.as('chain')])
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    srcQuery = this.applyTransferFilter(srcQuery, filter)

    let dstQuery = this.db
      .selectFrom('InteropTransfer')
      .select(['type', sql<string>`"dstChain"`.as('chain')])
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    dstQuery = this.applyTransferFilter(dstQuery, filter)

    const rows = await this.db
      .selectFrom(srcQuery.unionAll(dstQuery).as('sub'))
      .select([
        'sub.type',
        sql<string[]>`array_agg(DISTINCT sub.chain ORDER BY sub.chain)`.as(
          'chains',
        ),
      ])
      .groupBy('sub.type')
      .execute()

    return rows.map((r) => ({
      type: r.type,
      chains: r.chains ?? [],
    }))
  }

  async getTopTokens(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        'srcSymbol',
        eb.fn.count('type').as('cnt'),
        sql<number>`ROUND(SUM("srcValueUsd")::numeric, 0)`.as('volume_usd'),
        eb.fn.min('srcAbstractTokenId').as('abstract_token_id'),
      ])
      .where('srcSymbol', 'is not', null)
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    query = this.applyTransferFilter(query, filter)

    const rows = await query
      .groupBy(['type', 'srcSymbol'])
      .orderBy('type')
      .orderBy('volume_usd', 'desc')
      .execute()

    // biome-ignore lint/suspicious/noExplicitAny: kysely query builder loses type after reassignment
    return rows.map((r: any) => ({
      type: r.type,
      symbol: r.srcSymbol as string,
      count: Number(r.cnt ?? 0),
      volumeUsd: Number(r.volume_usd ?? 0),
      abstractTokenId: (r.abstract_token_id as string) ?? undefined,
    }))
  }

  async getChainPairs(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        'srcChain',
        'dstChain',
        eb.fn.count('type').as('cnt'),
        sql<number>`ROUND(SUM("srcValueUsd")::numeric, 0)`.as('volume_usd'),
      ])
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    query = this.applyTransferFilter(query, filter)

    const rows = await query
      .groupBy(['type', 'srcChain', 'dstChain'])
      .orderBy('type')
      .orderBy('volume_usd', 'desc')
      .execute()

    return rows.map((r) => ({
      type: r.type,
      srcChain: r.srcChain,
      dstChain: r.dstChain,
      count: Number(r.cnt ?? 0),
      volumeUsd: Number(r.volume_usd ?? 0),
    }))
  }

  async getPathSpeedStats(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        'srcChain',
        'dstChain',
        eb.fn.count('type').as('cnt'),
        sql<number>`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration)`.as(
          'p50_sec',
        ),
      ])
      .where('duration', '>', 0)
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    query = this.applyTransferFilter(query, filter)

    const rows = await query.groupBy(['type', 'srcChain', 'dstChain']).execute()

    return rows.map((r) => ({
      type: r.type,
      srcChain: r.srcChain,
      dstChain: r.dstChain,
      count: Number(r.cnt ?? 0),
      p50Sec: Number(r.p50_sec ?? 0),
    }))
  }

  async getTransferSizeDistribution(
    typePatterns: string[],
    since: UnixTime,
    filter: TransferFilter = 'excludeNonMinting',
  ) {
    if (typePatterns.length === 0) return []

    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        eb.fn
          .countAll()
          .filterWhere('srcValueUsd', '<', 100)
          .as('count_under_100'),
        eb.fn
          .countAll()
          .filterWhere('srcValueUsd', '>=', 100)
          .filterWhere('srcValueUsd', '<', 1000)
          .as('count_100_to_1k'),
        eb.fn
          .countAll()
          .filterWhere('srcValueUsd', '>=', 1000)
          .filterWhere('srcValueUsd', '<', 10000)
          .as('count_1k_to_10k'),
        eb.fn
          .countAll()
          .filterWhere('srcValueUsd', '>=', 10000)
          .filterWhere('srcValueUsd', '<', 100000)
          .as('count_10k_to_100k'),
        eb.fn
          .countAll()
          .filterWhere('srcValueUsd', '>=', 100000)
          .as('count_over_100k'),
      ])
      .where('srcValueUsd', 'is not', null)
      .where('timestamp', '>=', UnixTime.toDate(since))
      .where((eb) => eb.or(typePatterns.map((p) => eb('type', 'like', p))))
    query = this.applyTransferFilter(query, filter)
    query = query.groupBy('type')

    const rows = await query.execute()

    // biome-ignore lint/suspicious/noExplicitAny: kysely query builder loses type after reassignment
    return rows.map((r: any) => ({
      type: r.type as string,
      under100: Number(r.count_under_100 ?? 0),
      from100To1K: Number(r.count_100_to_1k ?? 0),
      from1KTo10K: Number(r.count_1k_to_10k ?? 0),
      from10KTo100K: Number(r.count_10k_to_100k ?? 0),
      over100K: Number(r.count_over_100k ?? 0),
    }))
  }

  async getMissingTokensInfo(): Promise<InteropMissingTokenInfo[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .select([
        'plugin',
        'srcValueUsd',
        'dstValueUsd',
        'srcChain',
        'srcTokenAddress',
        'dstChain',
        'dstTokenAddress',
      ])
      .where('isProcessed', '=', true)
      .where((eb) =>
        eb.or([eb('srcValueUsd', 'is', null), eb('dstValueUsd', 'is', null)]),
      )
      .execute()

    const chainAddressCounts = new Map<string, number>()
    const chainAddressPlugins = new Map<string, Set<string>>()

    for (const row of rows) {
      if (row.srcValueUsd === null && row.srcChain && row.srcTokenAddress) {
        const key = `${row.srcChain}:${row.srcTokenAddress}`
        chainAddressCounts.set(key, (chainAddressCounts.get(key) || 0) + 1)
        const plugins = chainAddressPlugins.get(key)
        if (!plugins) {
          chainAddressPlugins.set(key, new Set())
        } else {
          plugins.add(row.plugin)
        }
      }
      if (row.dstValueUsd === null && row.dstChain && row.dstTokenAddress) {
        const key = `${row.dstChain}:${row.dstTokenAddress}`
        chainAddressCounts.set(key, (chainAddressCounts.get(key) || 0) + 1)
        const plugins = chainAddressPlugins.get(key)
        if (!plugins) {
          chainAddressPlugins.set(key, new Set())
        } else {
          plugins.add(row.plugin)
        }
      }
    }

    const result: InteropMissingTokenInfo[] = []
    for (const [key, count] of chainAddressCounts) {
      const [chain, tokenAddress] = key.split(':')
      const plugins = Array.from(
        chainAddressPlugins.get(key) || new Set<string>(),
      ).sort()
      result.push({
        chain: chain as string,
        tokenAddress: tokenAddress as string,
        count,
        plugins,
      })
    }

    return result
  }

  // biome-ignore lint/suspicious/noExplicitAny: kysely query builder loses type after reassignment
  private applyTransferFilter(query: any, filter: TransferFilter) {
    if (filter === 'onlyLiquidityBased') {
      return query
        .where('srcWasBurned', '=', false)
        .where('dstWasMinted', '=', false)
    }
    // biome-ignore lint/suspicious/noExplicitAny: kysely expression builder type
    return query.where((eb: any) =>
      eb.or([
        eb('bridgeType', '!=', 'nonMinting'),
        eb('bridgeType', 'is', null),
      ]),
    )
  }
}
