import {
  type Address32,
  assert,
  type InteropBridgeType,
  InteropBridgeTypeValues,
  type KnownInteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  type Expression,
  type ExpressionBuilder,
  type Insertable,
  type Selectable,
  type SqlBool,
  sql,
} from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DB, InteropTransfer } from '../kysely/generated/types'

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

export interface InteropTransferRecord {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  transferId: string
  type: string
  duration: number | undefined
  timestamp: UnixTime
  srcTime: UnixTime | undefined
  srcChain: string
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  srcTokenAddress: string | undefined
  srcRawAmount: bigint | undefined
  srcWasBurned: boolean | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcPrice: number | undefined
  srcValueUsd: number | undefined
  dstTime: UnixTime | undefined
  dstChain: string
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
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

export interface InteropDeploymentStatsRecord {
  chain: string
  address: string
  abstractTokenId: string | undefined
  symbol: string | undefined
  plugin: string
  volumeUsd: number
  transferCount: number
  valuedTransferCount: number
}

export interface InteropSupplyChangeRequest {
  chain: string
  address: string
}

export interface InteropSupplyChangeStatsRecord
  extends InteropSupplyChangeRequest {
  mintedRaw: string
  burnedRaw: string
  transferCount: number
  missingAmountCount: number
}

export interface InteropTransferUpdate {
  srcAbstractTokenId: string | null
  srcSymbol: string | null
  srcPrice: number | null
  srcAmount: number | null
  srcValueUsd: number | null
  dstAbstractTokenId: string | null
  dstSymbol: string | null
  dstPrice: number | null
  dstAmount: number | null
  dstValueUsd: number | null
}

export interface InteropTransferFinancialsFilter {
  transferId?: string
  srcChain?: string
  srcTokenAddress?: string
  srcAbstractTokenId?: string
  srcSymbol?: string
  dstChain?: string
  dstTokenAddress?: string
  dstAbstractTokenId?: string
  dstSymbol?: string
  /** Inclusive lower bound for the transfer timestamp. */
  from?: UnixTime
  /** Inclusive upper bound for the transfer timestamp. */
  to?: UnixTime
}

/** Transfer timestamp interval with an exclusive lower and inclusive upper bound. */
export interface InteropTransferTimeRange {
  from: UnixTime
  to: UnixTime
}

export interface InteropTransferFinancialsStats {
  totalCount: number
  unprocessedCount: number
  missingSrcValueCount: number
  missingDstValueCount: number
  srcValueUsdSum: number
  dstValueUsdSum: number
}

export function hasAnyInteropTransferFinancialsFilter(
  filter: InteropTransferFinancialsFilter,
): boolean {
  return Object.values(filter).some((value) => value !== undefined)
}

export interface InteropTransferTokenAddress {
  chain: string
  address: string
}

export interface InteropTransferTokenAddressBatch {
  latestSerialId: string | undefined
  transferCount: number
  tokenAddresses: InteropTransferTokenAddress[]
}

export interface InteropTransferBatch {
  latestSerialId: string | undefined
  transfers: InteropTransferRecord[]
}

/**
 * One row per unique combination of token pair and bridge-type evidence,
 * aggregated over all retained transfers. `sampleTransferId` is the id of an
 * arbitrary transfer belonging to the group, so callers that need a full
 * transfer row as evidence can fetch exactly one by primary key instead of
 * holding every transfer in memory.
 */
export interface InteropTokenRouteRecord {
  plugin: string
  srcChain: string
  srcTokenAddress: string | undefined
  dstChain: string
  dstTokenAddress: string | undefined
  bridgeType: KnownInteropBridgeType | undefined
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
  transferCount: number
  sampleTransferId: string
  /** Tx hashes of the sample transfer (the row behind `sampleTransferId`),
   * so route consumers can point a human at an explorer without loading the
   * full transfer row. */
  sampleSrcTxHash: string | undefined
  sampleDstTxHash: string | undefined
}

interface PartialAbstractTokenFilter {
  chain: string
  address: Address32
}

const CASE_INSENSITIVE_FINANCIALS_COLUMNS = [
  'srcTokenAddress',
  'srcAbstractTokenId',
  'srcSymbol',
  'dstTokenAddress',
  'dstAbstractTokenId',
  'dstSymbol',
] as const

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
    duration: row.duration ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: row.srcTime ? UnixTime.fromDate(row.srcTime) : undefined,
    srcChain: row.srcChain,
    srcTxHash: row.srcTxHash ?? undefined,
    srcLogIndex: row.srcLogIndex ?? undefined,
    srcEventId: row.srcEventId ?? undefined,
    srcTokenAddress: row.srcTokenAddress ?? undefined,
    srcRawAmount: row.srcRawAmount ? BigInt(row.srcRawAmount) : undefined,
    srcWasBurned: row.srcWasBurned ?? undefined,
    srcAbstractTokenId: row.srcAbstractTokenId ?? undefined,
    srcSymbol: row.srcSymbol ?? undefined,
    srcAmount: row.srcAmount ?? undefined,
    srcPrice: row.srcPrice ?? undefined,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstTime: row.dstTime ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain,
    dstTxHash: row.dstTxHash ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
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
    duration: record.duration ?? null,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime: record.srcTime ? UnixTime.toDate(record.srcTime) : null,
    srcChain: record.srcChain ?? null,
    srcTxHash: record.srcTxHash?.toLowerCase() ?? null,
    srcLogIndex: record.srcLogIndex ?? null,
    srcEventId: record.srcEventId ?? null,
    srcTokenAddress: record.srcTokenAddress,
    srcRawAmount: record.srcRawAmount?.toString(),
    srcWasBurned: record.srcWasBurned,
    srcAbstractTokenId: record.srcAbstractTokenId,
    srcSymbol: record.srcSymbol,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstTime: record.dstTime ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain ?? null,
    dstTxHash: record.dstTxHash?.toLowerCase() ?? null,
    dstLogIndex: record.dstLogIndex ?? null,
    dstEventId: record.dstEventId ?? null,
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

export interface InteropSuspiciousTransferRecord extends InteropTransferRecord {
  valueDifferencePercent: number
}

export interface InteropTransferCursor {
  timestamp: UnixTime
  transferId: string
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

  async getByFinancialsFilter(
    filter: InteropTransferFinancialsFilter,
    limit: number,
  ): Promise<InteropTransferRecord[]> {
    assert(limit > 0, 'limit must be a positive number')
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where((eb) => this.financialsFilterExpression(eb, filter))
      .orderBy('timestamp', 'desc')
      .orderBy('transferId', 'desc')
      .limit(limit)
      .execute()

    return rows.map(toRecord)
  }

  async getFinancialsStatsByFilter(
    filter: InteropTransferFinancialsFilter,
  ): Promise<InteropTransferFinancialsStats> {
    const row = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        eb.fn.countAll().as('totalCount'),
        sql<string>`COUNT(*) FILTER (WHERE "isProcessed" = false)`.as(
          'unprocessedCount',
        ),
        sql<string>`COUNT(*) FILTER (WHERE "srcValueUsd" IS NULL)`.as(
          'missingSrcValueCount',
        ),
        sql<string>`COUNT(*) FILTER (WHERE "dstValueUsd" IS NULL)`.as(
          'missingDstValueCount',
        ),
        eb.fn.sum('srcValueUsd').as('srcValueUsdSum'),
        eb.fn.sum('dstValueUsd').as('dstValueUsdSum'),
      ])
      .where((eb) => this.financialsFilterExpression(eb, filter))
      .executeTakeFirst()

    return {
      totalCount: Number(row?.totalCount ?? 0),
      unprocessedCount: Number(row?.unprocessedCount ?? 0),
      missingSrcValueCount: Number(row?.missingSrcValueCount ?? 0),
      missingDstValueCount: Number(row?.missingDstValueCount ?? 0),
      srcValueUsdSum: Number(row?.srcValueUsdSum ?? 0),
      dstValueUsdSum: Number(row?.dstValueUsdSum ?? 0),
    }
  }

  async getTokenRoutes(): Promise<InteropTokenRouteRecord[]> {
    const groupColumns = [
      'plugin',
      'srcChain',
      'srcTokenAddress',
      'dstChain',
      'dstTokenAddress',
      'bridgeType',
      'srcWasBurned',
      'dstWasMinted',
    ] as const

    // The sample tx hashes must come from the same row as `sampleTransferId`
    // (mixing max() per column would stitch hashes from different transfers),
    // hence the join back on the primary key instead of extra aggregates.
    // Transfer ids are random, so a bare max() would pick an arbitrary row;
    // groups can mix fully hashed transfers with partially observed ones
    // (a side's token address comes from the message payload even when its
    // event — and thus tx hash — was never seen), so prefer a fully hashed
    // sample, then any hashed one, before settling for an arbitrary row.
    const rows = await this.db
      .with('route', (qb) =>
        qb
          .selectFrom('InteropTransfer')
          .select((eb) => [
            ...groupColumns,
            eb.fn.countAll().as('transferCount'),
            eb.fn
              .coalesce(
                eb.fn
                  .max('transferId')
                  .filterWhere('srcTxHash', 'is not', null)
                  .filterWhere('dstTxHash', 'is not', null),
                eb.fn
                  .max('transferId')
                  .filterWhere((eb) =>
                    eb.or([
                      eb('srcTxHash', 'is not', null),
                      eb('dstTxHash', 'is not', null),
                    ]),
                  ),
                eb.fn.max('transferId'),
              )
              .as('sampleTransferId'),
          ])
          .groupBy([...groupColumns]),
      )
      .selectFrom('route')
      .innerJoin(
        'InteropTransfer as sample',
        'sample.transferId',
        'route.sampleTransferId',
      )
      .select([
        ...groupColumns.map((column) => `route.${column}` as const),
        'route.transferCount',
        'route.sampleTransferId',
        'sample.srcTxHash as sampleSrcTxHash',
        'sample.dstTxHash as sampleDstTxHash',
      ])
      .execute()

    return rows.map((row) => {
      if (row.bridgeType !== null && !isInteropBridgeType(row.bridgeType)) {
        throw new Error(
          `Invalid interop transfer bridge type: ${row.bridgeType} for transfer ${row.sampleTransferId}`,
        )
      }

      return {
        plugin: row.plugin,
        srcChain: row.srcChain,
        srcTokenAddress: row.srcTokenAddress ?? undefined,
        dstChain: row.dstChain,
        dstTokenAddress: row.dstTokenAddress ?? undefined,
        bridgeType:
          row.bridgeType === null
            ? undefined
            : (row.bridgeType as KnownInteropBridgeType),
        srcWasBurned: row.srcWasBurned ?? undefined,
        dstWasMinted: row.dstWasMinted ?? undefined,
        transferCount: Number(row.transferCount),
        sampleTransferId: row.sampleTransferId,
        sampleSrcTxHash: row.sampleSrcTxHash ?? undefined,
        sampleDstTxHash: row.sampleDstTxHash ?? undefined,
      }
    })
  }

  async findByTransferId(
    transferId: string,
  ): Promise<InteropTransferRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('transferId', '=', transferId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
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

  async getDeploymentStatsByRange(
    fromExclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<InteropDeploymentStatsRecord[]> {
    interface Row {
      chain: string
      address: string
      abstractTokenId: string | null
      symbol: string | null
      plugin: string
      volumeUsd: number
      transferCount: number
      valuedTransferCount: number
    }

    // Keep the aggregation close to the data. A seven-day raw transfer window
    // can contain hundreds of thousands of rows, while the coverage view needs
    // one row per deployment/plugin combination.
    const query = sql<Row>`
      WITH window_transfers AS MATERIALIZED (
        SELECT
          plugin,
          timestamp,
          "srcChain",
          "srcTokenAddress",
          "srcAbstractTokenId",
          "srcSymbol",
          "srcValueUsd",
          "dstChain",
          "dstTokenAddress",
          "dstAbstractTokenId",
          "dstSymbol",
          "dstValueUsd"
        FROM "InteropTransfer"
        WHERE timestamp > ${UnixTime.toDate(fromExclusive)}
          AND timestamp <= ${UnixTime.toDate(toInclusive)}
      ),
      sides AS (
        SELECT
          "srcChain" AS chain,
          "srcTokenAddress" AS address,
          "srcAbstractTokenId" AS "abstractTokenId",
          "srcSymbol" AS symbol,
          "srcValueUsd" AS "valueUsd",
          plugin
        FROM window_transfers
        WHERE "srcTokenAddress" IS NOT NULL

        UNION ALL

        SELECT
          "dstChain" AS chain,
          "dstTokenAddress" AS address,
          "dstAbstractTokenId" AS "abstractTokenId",
          "dstSymbol" AS symbol,
          "dstValueUsd" AS "valueUsd",
          plugin
        FROM window_transfers
        WHERE "dstTokenAddress" IS NOT NULL
          AND (
            "srcTokenAddress" IS NULL
            OR "srcChain" <> "dstChain"
            OR "srcTokenAddress" <> "dstTokenAddress"
          )
      )
      SELECT
        chain,
        address,
        max("abstractTokenId") AS "abstractTokenId",
        max(symbol) AS symbol,
        plugin,
        sum(coalesce("valueUsd", 0))::double precision AS "volumeUsd",
        count(*)::integer AS "transferCount",
        count("valueUsd")::integer AS "valuedTransferCount"
      FROM sides
      GROUP BY chain, address, plugin
    `.compile(this.db)

    const result = await this.db.executeQuery(query)
    return result.rows.map((row) => ({
      chain: row.chain,
      address: row.address,
      abstractTokenId: row.abstractTokenId ?? undefined,
      symbol: row.symbol ?? undefined,
      plugin: row.plugin,
      volumeUsd: Number(row.volumeUsd),
      transferCount: Number(row.transferCount),
      valuedTransferCount: Number(row.valuedTransferCount),
    }))
  }

  async getSupplyChangeStatsByRange(
    requests: InteropSupplyChangeRequest[],
    fromExclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<InteropSupplyChangeStatsRecord[]> {
    if (requests.length === 0) return []

    interface Row {
      chain: string
      address: string
      mintedRaw: string
      burnedRaw: string
      transferCount: number
      missingAmountCount: number
    }

    const query = sql<Row>`
      WITH targets AS (
        SELECT *
        FROM unnest(
          ${requests.map((request) => request.chain)}::varchar[],
          ${requests.map((request) => request.address)}::varchar[]
        ) AS target(chain, address)
      ),
      legs AS (
        SELECT
          target.chain,
          target.address,
          transfer."dstRawAmount" AS minted,
          NULL::numeric AS burned
        FROM targets AS target
        JOIN "InteropTransfer" AS transfer
          ON transfer."dstChain" = target.chain
          AND right(lower(transfer."dstTokenAddress"), 40) = right(lower(target.address), 40)
        WHERE coalesce(transfer."dstTime", transfer.timestamp) > ${UnixTime.toDate(fromExclusive)}
          AND coalesce(transfer."dstTime", transfer.timestamp) <= ${UnixTime.toDate(toInclusive)}
          AND transfer."dstWasMinted" IS TRUE

        UNION ALL

        SELECT
          target.chain,
          target.address,
          NULL::numeric AS minted,
          transfer."srcRawAmount" AS burned
        FROM targets AS target
        JOIN "InteropTransfer" AS transfer
          ON transfer."srcChain" = target.chain
          AND right(lower(transfer."srcTokenAddress"), 40) = right(lower(target.address), 40)
        WHERE coalesce(transfer."srcTime", transfer.timestamp) > ${UnixTime.toDate(fromExclusive)}
          AND coalesce(transfer."srcTime", transfer.timestamp) <= ${UnixTime.toDate(toInclusive)}
          AND transfer."srcWasBurned" IS TRUE
      )
      SELECT
        chain,
        address,
        coalesce(sum(minted), 0)::text AS "mintedRaw",
        coalesce(sum(burned), 0)::text AS "burnedRaw",
        count(*)::integer AS "transferCount",
        count(*) FILTER (
          WHERE (minted IS NULL AND burned IS NULL)
        )::integer AS "missingAmountCount"
      FROM legs
      GROUP BY chain, address
    `.compile(this.db)

    const result = await this.db.executeQuery(query)
    return result.rows.map((row) => ({
      chain: row.chain,
      address: row.address,
      mintedRaw: row.mintedRaw,
      burnedRaw: row.burnedRaw,
      transferCount: Number(row.transferCount),
      missingAmountCount: Number(row.missingAmountCount),
    }))
  }

  async getByType(
    type: string,
    options: {
      plugin?: string
      srcChain?: string
      dstChain?: string
      timeRange?: InteropTransferTimeRange
    } = {},
  ): Promise<InteropTransferRecord[]> {
    let query = this.db.selectFrom('InteropTransfer').where('type', '=', type)

    if (options.plugin !== undefined) {
      query = query.where('plugin', '=', options.plugin)
    }

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    if (options.timeRange !== undefined) {
      query = query
        .where('timestamp', '>', UnixTime.toDate(options.timeRange.from))
        .where('timestamp', '<=', UnixTime.toDate(options.timeRange.to))
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getValueMismatchTransfers(
    valueDifferencePercentThreshold: number,
    options: {
      minimumSideValueUsdThreshold?: number
      timeRange?: InteropTransferTimeRange
    } = {},
  ): Promise<InteropSuspiciousTransferRecord[]> {
    const minimumSideValueUsdThreshold =
      options.minimumSideValueUsdThreshold ?? 0
    assert(
      valueDifferencePercentThreshold > 0,
      'valueDifferencePercentThreshold must be a positive number',
    )
    assert(
      minimumSideValueUsdThreshold >= 0,
      'minimumSideValueUsdThreshold must be a non-negative number',
    )

    const maxSideValueUsd = sql<number>`
      GREATEST(ABS("srcValueUsd"::numeric), ABS("dstValueUsd"::numeric))
    `
    const absoluteValueDifferenceUsd = sql<number>`
      ABS("srcValueUsd"::numeric - "dstValueUsd"::numeric)
    `
    const valueDifferencePercent = sql<number>`
      CASE
        WHEN ${maxSideValueUsd} = 0 THEN 0
        ELSE (${absoluteValueDifferenceUsd} / ${maxSideValueUsd}) * 100
      END
    `

    let query = this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .select(valueDifferencePercent.as('valueDifferencePercent'))
      .where('srcValueUsd', 'is not', null)
      .where('dstValueUsd', 'is not', null)
      .where(sql<boolean>`ABS("srcValueUsd") > ${minimumSideValueUsdThreshold}`)
      .where(sql<boolean>`ABS("dstValueUsd") > ${minimumSideValueUsdThreshold}`)
      .where(
        sql<boolean>`
          ${maxSideValueUsd} > 0
          AND (${absoluteValueDifferenceUsd} * 100) > (${valueDifferencePercentThreshold} * ${maxSideValueUsd})
        `,
      )

    if (options.timeRange !== undefined) {
      query = query
        .where('timestamp', '>', UnixTime.toDate(options.timeRange.from))
        .where('timestamp', '<=', UnixTime.toDate(options.timeRange.to))
    }

    const rows = await query
      .orderBy(valueDifferencePercent, 'desc')
      .orderBy('timestamp', 'desc')
      .orderBy('transferId', 'desc')
      .execute()

    return rows.map((row) => ({
      ...toRecord(row),
      valueDifferencePercent: Number(row.valueDifferencePercent ?? 0),
    }))
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

  async getProjectTransfersPage(options: {
    plugins: string[]
    snapshotTimestamp: UnixTime
    sourceChains: string[]
    destinationChains: string[]
    abstractTokenId?: string
    cursor?: InteropTransferCursor
    limit: number
  }): Promise<InteropTransferRecord[]> {
    if (
      options.plugins.length === 0 ||
      options.sourceChains.length === 0 ||
      options.destinationChains.length === 0 ||
      options.limit <= 0
    ) {
      return []
    }

    const from = options.snapshotTimestamp - UnixTime.DAY
    let query = this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('timestamp', '>', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(options.snapshotTimestamp))
      .where('plugin', 'in', options.plugins)
      .where('srcChain', 'in', options.sourceChains)
      .where('dstChain', 'in', options.destinationChains)
      .whereRef('srcChain', '!=', 'dstChain')

    const abstractTokenId = options.abstractTokenId
    if (abstractTokenId !== undefined) {
      query = query.where((eb) =>
        eb.or([
          eb('srcAbstractTokenId', '=', abstractTokenId),
          eb('dstAbstractTokenId', '=', abstractTokenId),
        ]),
      )
    }

    const cursor = options.cursor
    if (cursor) {
      const cursorDate = UnixTime.toDate(cursor.timestamp)
      query = query.where((eb) =>
        eb.or([
          eb('timestamp', '<', cursorDate),
          eb.and([
            eb('timestamp', '=', cursorDate),
            eb('transferId', '<', cursor.transferId),
          ]),
        ]),
      )
    }

    const rows = await query
      .orderBy('timestamp', 'desc')
      .orderBy('transferId', 'desc')
      .limit(options.limit)
      .execute()

    return rows.map(toRecord)
  }

  async getUnprocessed(limit?: number) {
    let query = this.db
      .selectFrom('InteropTransfer')
      .where('isProcessed', '=', false)
      .selectAll()

    if (limit !== undefined) {
      query = query.limit(limit)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getTokenAddressesAfterSerialId(
    serialId: string,
  ): Promise<InteropTransferTokenAddressBatch> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .select([
        'serialId',
        'srcChain',
        'srcTokenAddress',
        'dstChain',
        'dstTokenAddress',
      ])
      .where('serialId', '>', serialId)
      .orderBy('serialId', 'asc')
      .execute()

    const tokenAddresses = new Map<string, InteropTransferTokenAddress>()
    for (const row of rows) {
      if (row.srcTokenAddress) {
        const address = { chain: row.srcChain, address: row.srcTokenAddress }
        tokenAddresses.set(`${address.chain}:${address.address}`, address)
      }
      if (row.dstTokenAddress) {
        const address = { chain: row.dstChain, address: row.dstTokenAddress }
        tokenAddresses.set(`${address.chain}:${address.address}`, address)
      }
    }

    return {
      latestSerialId: rows.at(-1)?.serialId,
      transferCount: rows.length,
      tokenAddresses: Array.from(tokenAddresses.values()),
    }
  }

  async getAfterSerialId(
    serialId: string,
    limit: number,
  ): Promise<InteropTransferBatch> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('serialId', '>', serialId)
      .orderBy('serialId', 'asc')
      .limit(limit)
      .execute()

    return {
      latestSerialId: rows.at(-1)?.serialId,
      transfers: rows.map(toRecord),
    }
  }

  async getWithPartialAbstractTokenIds(): Promise<InteropTransferRecord[]> {
    const rows = await this.getPartialAbstractTokenIdsQuery()
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async getWithPartialAbstractTokenIdsForToken(
    filter: PartialAbstractTokenFilter,
  ): Promise<InteropTransferRecord[]> {
    const rows = await this.getPartialAbstractTokenIdsQuery()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('srcChain', '=', filter.chain),
            eb('srcTokenAddress', '=', filter.address),
          ]),
          eb.and([
            eb('dstChain', '=', filter.chain),
            eb('dstTokenAddress', '=', filter.address),
          ]),
        ]),
      )
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  private getPartialAbstractTokenIdsQuery() {
    return this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('srcAbstractTokenId', 'is', null),
            eb('dstAbstractTokenId', 'is not', null),
          ]),
          eb.and([
            eb('srcAbstractTokenId', 'is not', null),
            eb('dstAbstractTokenId', 'is', null),
          ]),
        ]),
      )
  }

  async updateManyFinancials(
    updates: { id: string; update: InteropTransferUpdate }[],
  ): Promise<void> {
    if (updates.length === 0) {
      return
    }

    // unnest instead of a VALUES list: each column binds as a single array
    // parameter, so the statement stays within Postgres' 65535 parameter
    // limit regardless of the number of rows.
    const v = sql<{ transferId: string } & InteropTransferUpdate>`unnest(
      ${updates.map((u) => u.id)}::varchar[],
      ${updates.map((u) => u.update.srcAbstractTokenId)}::varchar[],
      ${updates.map((u) => u.update.srcSymbol)}::varchar[],
      ${updates.map((u) => u.update.srcPrice)}::real[],
      ${updates.map((u) => u.update.srcAmount)}::real[],
      ${updates.map((u) => u.update.srcValueUsd)}::real[],
      ${updates.map((u) => u.update.dstAbstractTokenId)}::varchar[],
      ${updates.map((u) => u.update.dstSymbol)}::varchar[],
      ${updates.map((u) => u.update.dstPrice)}::real[],
      ${updates.map((u) => u.update.dstAmount)}::real[],
      ${updates.map((u) => u.update.dstValueUsd)}::real[]
    )`.as<'v'>(
      sql`v(
        "transferId",
        "srcAbstractTokenId", "srcSymbol", "srcPrice", "srcAmount", "srcValueUsd",
        "dstAbstractTokenId", "dstSymbol", "dstPrice", "dstAmount", "dstValueUsd"
      )`,
    )

    await this.db
      .updateTable('InteropTransfer')
      .from(v)
      .set((eb) => ({
        srcAbstractTokenId: eb.ref('v.srcAbstractTokenId'),
        srcSymbol: eb.ref('v.srcSymbol'),
        srcPrice: eb.ref('v.srcPrice'),
        srcAmount: eb.ref('v.srcAmount'),
        srcValueUsd: eb.ref('v.srcValueUsd'),
        dstAbstractTokenId: eb.ref('v.dstAbstractTokenId'),
        dstSymbol: eb.ref('v.dstSymbol'),
        dstPrice: eb.ref('v.dstPrice'),
        dstAmount: eb.ref('v.dstAmount'),
        dstValueUsd: eb.ref('v.dstValueUsd'),
        isProcessed: true,
      }))
      .whereRef('InteropTransfer.transferId', '=', 'v.transferId')
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

  async markAsUnprocessedByFinancialsFilter(
    filter: InteropTransferFinancialsFilter,
  ): Promise<number> {
    const result = await this.db
      .updateTable('InteropTransfer')
      .set({ isProcessed: false })
      .where('isProcessed', '=', true)
      .where((eb) => this.financialsFilterExpression(eb, filter))
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  private financialsFilterExpression(
    eb: ExpressionBuilder<DB, 'InteropTransfer'>,
    filter: InteropTransferFinancialsFilter,
  ): Expression<SqlBool> {
    assert(
      hasAnyInteropTransferFinancialsFilter(filter),
      'At least one filter is required',
    )

    const conditions: Expression<SqlBool>[] = []
    if (filter.transferId !== undefined) {
      conditions.push(eb('transferId', '=', filter.transferId))
    }
    if (filter.srcChain !== undefined) {
      conditions.push(eb('srcChain', '=', filter.srcChain))
    }
    if (filter.dstChain !== undefined) {
      conditions.push(eb('dstChain', '=', filter.dstChain))
    }
    for (const column of CASE_INSENSITIVE_FINANCIALS_COLUMNS) {
      const value = filter[column]
      if (value !== undefined) {
        conditions.push(
          eb(eb.fn<string>('lower', [column]), '=', value.toLowerCase()),
        )
      }
    }
    if (filter.from !== undefined) {
      conditions.push(eb('timestamp', '>=', UnixTime.toDate(filter.from)))
    }
    if (filter.to !== undefined) {
      conditions.push(eb('timestamp', '<=', UnixTime.toDate(filter.to)))
    }

    return eb.and(conditions)
  }

  async getStats(
    timeRange?: InteropTransferTimeRange,
  ): Promise<InteropTransfersStatsRecord[]> {
    let query = this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'plugin',
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])

    if (timeRange !== undefined) {
      query = query
        .where('timestamp', '>', UnixTime.toDate(timeRange.from))
        .where('timestamp', '<=', UnixTime.toDate(timeRange.to))
    }

    const overallStats = await query.groupBy(['plugin', 'type']).execute()

    return overallStats.map((overall) => ({
      plugin: overall.plugin,
      type: overall.type,
      count: Number(overall.count),
      avgDuration: Number(overall.avgDuration),
      srcValueSum: Number(overall.srcValueSum),
      dstValueSum: Number(overall.dstValueSum),
    }))
  }

  async getDetailedStats(
    timeRange?: InteropTransferTimeRange,
  ): Promise<InteropTransfersDetailedStatsRecord[]> {
    let query = this.db
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

    if (timeRange !== undefined) {
      query = query
        .where('timestamp', '>', UnixTime.toDate(timeRange.from))
        .where('timestamp', '<=', UnixTime.toDate(timeRange.to))
    }

    const chainStats = await query
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

    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where((eb) =>
        eb.or(
          items.map((item) =>
            eb.and([
              eb('srcTxHash', '=', item.srcTxHash.toLowerCase()),
              eb('dstTxHash', '=', item.dstTxHash.toLowerCase()),
            ]),
          ),
        ),
      )
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
}
