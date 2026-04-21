import { Logger } from '@l2beat/backend-tools'
import type { PrivacyFlowSource, PrivacyMetricSource } from '@l2beat/config'
import { executeFlowExtract } from '@l2beat/config/build/privacy/executeFlowExtract'
import { TICKERS } from '@l2beat/config/build/projects/tornado-cash/tornado-cash'
import {
  encodeErc20Balance,
  HttpClient,
  type IRpcClient,
  RpcClientCompat,
} from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import {
  type PrivacyBucketRow,
  upsertManyPrivacyBucketRows,
} from '../db/PrivacyBucketRepo'
import {
  applyPrivacyHistoryDelta,
  getAllPrivacyHistoryCursors,
  getAllPrivacyHistoryRows,
  type PrivacyHistoryCursor,
  type PrivacyHistoryDayRow,
} from '../db/PrivacyHistoryRepo'
import { getPrivacyProjects } from '../getPrivacyProjects'
import type { PrivacyProjectConfig } from '../types'

type Log = Awaited<ReturnType<IRpcClient['getLogs']>>[number]

const RPC_CLIENTS = new Map<string, IRpcClient>()
const HTTP_CLIENT = new HttpClient()

interface TokenInfo {
  ticker: string
  decimals: number
  price: number | null
}

interface RefreshContext {
  logger: Logger
  latestBlockByChain: Map<string, Promise<number>>
  logsByKey: Map<string, Promise<Log[]>>
  blockTimestampByKey: Map<string, Promise<number>>
  timestamp: number
}

interface DepositSummary {
  total: number
  last7d: number
  last30d: number
}

export interface SkippedBucket {
  project: string
  asset: string
  bucket: string
  reason: string
}

const NORMALIZED_TICKERS = new Map<string, TokenInfo>(
  Object.entries(TICKERS).map(([address, value]) => [
    address.toLowerCase(),
    {
      ticker: value.ticker,
      decimals: value.decimals,
      price:
        'price' in value &&
        (typeof value.price === 'number' || value.price === null)
          ? value.price
          : null,
    },
  ]),
)
const WETH_INFO = [...NORMALIZED_TICKERS.values()].find(
  (token) => token.ticker === 'WETH',
)

let isRefreshing = false

export async function refreshPrivacySnapshot(logger: Logger): Promise<{
  written: number
  skipped: SkippedBucket[]
}> {
  if (isRefreshing) {
    return { written: 0, skipped: [] }
  }
  isRefreshing = true

  try {
    const projects = await getPrivacyProjects()
    const context: RefreshContext = {
      logger,
      latestBlockByChain: new Map(),
      logsByKey: new Map(),
      blockTimestampByKey: new Map(),
      timestamp: Math.floor(Date.now() / 1000),
    }

    const historyRefresh = await refreshPrivacyHistory(projects, context)
    const depositSummaryByBucket = buildDepositSummaryIndex(
      getAllPrivacyHistoryRows(),
      context.timestamp,
    )

    const batches = await Promise.all(
      projects.map((project) =>
        collectProjectRows(project, depositSummaryByBucket, context),
      ),
    )

    const rows: PrivacyBucketRow[] = []
    const skipped = [...historyRefresh.skipped]
    for (const batch of batches) {
      rows.push(...batch.rows)
      skipped.push(...batch.skipped)
    }

    upsertManyPrivacyBucketRows(rows)
    return { written: rows.length, skipped }
  } finally {
    isRefreshing = false
  }
}

async function refreshPrivacyHistory(
  projects: PrivacyProjectConfig[],
  context: RefreshContext,
): Promise<{ skipped: SkippedBucket[] }> {
  const cursorByKey = new Map(
    getAllPrivacyHistoryCursors().map((cursor) => [cursor.key, cursor]),
  )

  const tasks: Promise<
    | {
        rows: PrivacyHistoryDayRow[]
        cursor: PrivacyHistoryCursor
        skipped: null
      }
    | {
        rows: []
        cursor: null
        skipped: SkippedBucket
      }
  >[] = []

  for (const project of projects) {
    const projectId = project.id.toString()

    for (const asset of project.privacyInfo.assets) {
      const tokenInfo = getTokenInfo(asset.asset.address, asset.asset.symbol)
      const symbol = asset.asset.symbol ?? tokenInfo.ticker
      const assetKey = (asset.asset.address ?? symbol).toLowerCase()

      for (const bucket of asset.buckets) {
        if (!bucket.flows) continue

        if (bucket.flows.deposit) {
          tasks.push(
            collectHistoryDeltaForSource({
              project: project.slug,
              projectId,
              asset: symbol,
              assetKey,
              bucketId: bucket.id,
              direction: 'deposit',
              source: bucket.flows.deposit,
              sinceBlock: bucket.flows.sinceBlock,
              cursor: cursorByKey.get(
                historyCursorKey(projectId, assetKey, bucket.id, 'deposit'),
              ),
              context,
            }),
          )
        }

        if (bucket.flows.withdrawal) {
          tasks.push(
            collectHistoryDeltaForSource({
              project: project.slug,
              projectId,
              asset: symbol,
              assetKey,
              bucketId: bucket.id,
              direction: 'withdrawal',
              source: bucket.flows.withdrawal,
              sinceBlock: bucket.flows.sinceBlock,
              cursor: cursorByKey.get(
                historyCursorKey(projectId, assetKey, bucket.id, 'withdrawal'),
              ),
              context,
            }),
          )
        }
      }
    }
  }

  const results = await Promise.all(tasks)
  const rows: PrivacyHistoryDayRow[] = []
  const cursors: PrivacyHistoryCursor[] = []
  const skipped: SkippedBucket[] = []

  for (const result of results) {
    rows.push(...result.rows)
    if (result.cursor) {
      cursors.push(result.cursor)
    }
    if (result.skipped) {
      skipped.push(result.skipped)
    }
  }

  applyPrivacyHistoryDelta(rows, cursors)
  return { skipped }
}

async function collectHistoryDeltaForSource({
  project,
  projectId,
  asset,
  assetKey,
  bucketId,
  direction,
  source,
  sinceBlock,
  cursor,
  context,
}: {
  project: string
  projectId: string
  asset: string
  assetKey: string
  bucketId: string
  direction: 'deposit' | 'withdrawal'
  source: PrivacyFlowSource
  sinceBlock: number
  cursor: PrivacyHistoryCursor | undefined
  context: RefreshContext
}): Promise<
  | {
      rows: PrivacyHistoryDayRow[]
      cursor: PrivacyHistoryCursor
      skipped: null
    }
  | {
      rows: []
      cursor: null
      skipped: SkippedBucket
    }
> {
  try {
    const client = getRpcClient(source.chain)
    const latestBlock = await getLatestBlockNumber(
      source.chain,
      client,
      context,
    )
    const nextBlock = (cursor?.lastSyncedBlock ?? sinceBlock - 1) + 1
    const fromBlock = Math.max(sinceBlock, nextBlock)

    const nextCursor: PrivacyHistoryCursor = {
      key: historyCursorKey(projectId, assetKey, bucketId, direction),
      lastSyncedBlock: latestBlock,
      syncedAt: context.timestamp,
    }

    if (fromBlock > latestBlock) {
      return { rows: [], cursor: nextCursor, skipped: null }
    }

    const logs = await getLogs(source, fromBlock, latestBlock, context)
    const rowsByDay = new Map<string, PrivacyHistoryDayRow>()

    for (const log of logs) {
      const flow = executeFlowExtract(source, log)
      if (flow.count === 0 && flow.amount === 0n) {
        continue
      }

      const timestamp = UnixTime.toStartOf(
        await getLogTimestamp(source.chain, log, context),
        'day',
      )
      const key = historyRowKey(projectId, assetKey, bucketId, timestamp)
      const existing = rowsByDay.get(key)
      const row = existing ?? {
        projectId,
        assetKey,
        bucketId,
        timestamp,
        depositCount: 0,
        withdrawalCount: 0,
        depositAmount: '0',
        withdrawalAmount: '0',
      }

      if (direction === 'deposit') {
        row.depositCount += flow.count
        row.depositAmount = (BigInt(row.depositAmount) + flow.amount).toString()
      } else {
        row.withdrawalCount += flow.count
        row.withdrawalAmount = (
          BigInt(row.withdrawalAmount) + flow.amount
        ).toString()
      }

      rowsByDay.set(key, row)
    }

    return {
      rows: [...rowsByDay.values()],
      cursor: nextCursor,
      skipped: null,
    }
  } catch (error) {
    return {
      rows: [],
      cursor: null,
      skipped: {
        project,
        asset,
        bucket: bucketId,
        reason: `History refresh failed for ${direction}: ${formatError(error)}`,
      },
    }
  }
}

function buildDepositSummaryIndex(
  rows: PrivacyHistoryDayRow[],
  now: number,
): Map<string, DepositSummary> {
  const result = new Map<string, DepositSummary>()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 6 * UnixTime.DAY
  const last30dCutoff = currentDay - 29 * UnixTime.DAY

  for (const row of rows) {
    if (row.depositCount === 0) continue

    const key = bucketKey(row.projectId, row.assetKey, row.bucketId)
    const entry = result.get(key) ?? {
      total: 0,
      last7d: 0,
      last30d: 0,
    }

    entry.total += row.depositCount
    if (row.timestamp >= last7dCutoff) {
      entry.last7d += row.depositCount
    }
    if (row.timestamp >= last30dCutoff) {
      entry.last30d += row.depositCount
    }

    result.set(key, entry)
  }

  return result
}

async function collectProjectRows(
  project: PrivacyProjectConfig,
  depositSummaryByBucket: Map<string, DepositSummary>,
  context: RefreshContext,
): Promise<{ rows: PrivacyBucketRow[]; skipped: SkippedBucket[] }> {
  const projectId = project.id.toString()
  const batches = await Promise.all(
    project.privacyInfo.assets.map((asset) =>
      collectAssetRows(
        project,
        projectId,
        asset,
        depositSummaryByBucket,
        context,
      ),
    ),
  )

  const rows: PrivacyBucketRow[] = []
  const skipped: SkippedBucket[] = []
  for (const batch of batches) {
    rows.push(...batch.rows)
    skipped.push(...batch.skipped)
  }
  return { rows, skipped }
}

async function collectAssetRows(
  project: PrivacyProjectConfig,
  projectId: string,
  asset: PrivacyProjectConfig['privacyInfo']['assets'][number],
  depositSummaryByBucket: Map<string, DepositSummary>,
  context: RefreshContext,
): Promise<{ rows: PrivacyBucketRow[]; skipped: SkippedBucket[] }> {
  const tokenInfo = getTokenInfo(asset.asset.address, asset.asset.symbol)
  const symbol = asset.asset.symbol ?? tokenInfo.ticker
  const assetKey = (asset.asset.address ?? symbol).toLowerCase()

  const results = await Promise.all(
    asset.buckets.map((bucket) =>
      collectBucketRow(
        project,
        projectId,
        assetKey,
        bucket,
        tokenInfo.decimals,
        tokenInfo.price,
        depositSummaryByBucket.get(bucketKey(projectId, assetKey, bucket.id)),
        context,
      ).then(
        (row) => ({ row, skip: null as SkippedBucket | null }),
        (error: unknown): { row: null; skip: SkippedBucket } => ({
          row: null,
          skip: {
            project: project.slug,
            asset: symbol,
            bucket: bucket.id,
            reason: formatError(error),
          },
        }),
      ),
    ),
  )

  const rows: PrivacyBucketRow[] = []
  const skipped: SkippedBucket[] = []
  for (const result of results) {
    if (result.row) rows.push(result.row)
    if (result.skip) skipped.push(result.skip)
  }
  return { rows, skipped }
}

async function collectBucketRow(
  project: PrivacyProjectConfig,
  projectId: string,
  assetKey: string,
  bucket: PrivacyProjectConfig['privacyInfo']['assets'][number]['buckets'][number],
  decimals: number,
  priceUsd: number | null,
  depositSummary: DepositSummary | undefined,
  context: RefreshContext,
): Promise<PrivacyBucketRow> {
  const rawTotalAmount = bucket.totalValue
    ? await getBucketTotalValue(project, bucket.totalValue, context)
    : null

  const totalValueAmount =
    rawTotalAmount === null ? null : rawTotalAmount.toString()
  const totalAmountNumber =
    rawTotalAmount === null ? null : bigintToNumber(rawTotalAmount, decimals)
  const totalValueUsd =
    totalAmountNumber === null || priceUsd === null
      ? null
      : totalAmountNumber * priceUsd

  return {
    projectId,
    assetKey,
    bucketId: bucket.id,
    timestamp: context.timestamp,
    totalValueAmount,
    priceUsd,
    totalValueUsd,
    depositsTotal: depositSummary?.total ?? 0,
    deposits7d: depositSummary?.last7d ?? 0,
    deposits30d: depositSummary?.last30d ?? 0,
  }
}

async function evaluateBalanceMetric(
  source: Extract<
    PrivacyMetricSource,
    { type: 'nativeBalance' | 'erc20BalanceOf' }
  >,
  context: RefreshContext,
): Promise<bigint> {
  const client = getRpcClient(source.chain)

  if (source.type === 'nativeBalance') {
    return await client.getBalance(
      ChainSpecificAddress.address(source.holder),
      'latest',
    )
  }

  try {
    const response = await client.call(
      encodeErc20Balance(
        ChainSpecificAddress.address(source.tokenAddress),
        ChainSpecificAddress.address(source.holder),
      ),
      'latest',
    )
    return response.toString() === '0x' ? 0n : BigInt(response.toString())
  } catch (error) {
    context.logger.warn('balanceOf failed, returning 0', {
      chain: source.chain,
      tokenAddress: ChainSpecificAddress.address(
        source.tokenAddress,
      ).toString(),
      holder: ChainSpecificAddress.address(source.holder).toString(),
      error,
    })
    return 0n
  }
}

async function getBucketTotalValue(
  project: PrivacyProjectConfig,
  source: PrivacyMetricSource,
  context: RefreshContext,
): Promise<bigint> {
  if (!isBalanceMetricSource(source)) {
    throw new Error(
      `Unsupported total value metric source for ${project.slug}: ${source.type}`,
    )
  }
  return await evaluateBalanceMetric(source, context)
}

function getLogs(
  source: PrivacyFlowSource,
  fromBlock: number,
  toBlock: number,
  context: RefreshContext,
): Promise<Log[]> {
  const addressArg = source.address
    ? ChainSpecificAddress.address(source.address).toString()
    : ''
  const key = `${source.chain}|${addressArg}|${source.event}|${fromBlock}|${toBlock}`

  const cached = context.logsByKey.get(key)
  if (cached) return cached

  const client = getRpcClient(source.chain)
  const addresses = source.address
    ? [ChainSpecificAddress.address(source.address)]
    : undefined
  const promise = client.getLogs(fromBlock, toBlock, addresses, [source.event])
  context.logsByKey.set(key, promise)
  return promise
}

function getLogTimestamp(
  chain: string,
  log: Log,
  context: RefreshContext,
): Promise<number> {
  if (log.blockTimestamp !== undefined) {
    return Promise.resolve(log.blockTimestamp)
  }

  const key = `${chain}|${log.blockNumber}`
  const cached = context.blockTimestampByKey.get(key)
  if (cached) return cached

  const promise = getRpcClient(chain)
    .getBlock(log.blockNumber, false)
    .then((block) => block.timestamp)
  context.blockTimestampByKey.set(key, promise)
  return promise
}

function getLatestBlockNumber(
  chain: string,
  client: IRpcClient,
  context: RefreshContext,
): Promise<number> {
  const cached = context.latestBlockByChain.get(chain)
  if (cached) return cached
  const promise = client.getLatestBlockNumber()
  context.latestBlockByChain.set(chain, promise)
  return promise
}

function getRpcClient(chain: string): IRpcClient {
  const cached = RPC_CLIENTS.get(chain)
  if (cached) return cached

  const client = RpcClientCompat.create({
    http: HTTP_CLIENT,
    url: getRpcUrl(chain),
    chain,
    callsPerMinute: getRpcCallsPerMinute(chain),
    logger: Logger.SILENT,
    retryStrategy: 'RELIABLE',
  })
  RPC_CLIENTS.set(chain, client)
  return client
}

function getRpcUrl(chain: string): string {
  const upperChain = chain.replace(/-/g, '_').toUpperCase()
  const url =
    process.env[`${upperChain}_EVENT_RPC_URL_FOR_DISCOVERY`] ??
    process.env[`${upperChain}_RPC_URL_FOR_DISCOVERY`] ??
    process.env[`${upperChain}_RPC_URL`]

  if (!url) {
    throw new Error(
      `Missing RPC URL for ${chain}. Expected ${upperChain}_RPC_URL or discovery-specific override.`,
    )
  }
  return url
}

function getRpcCallsPerMinute(chain: string): number {
  const upperChain = chain.replace(/-/g, '_').toUpperCase()
  const raw = process.env[`${upperChain}_RPC_CALLS_PER_MINUTE`]
  const parsed = raw ? Number(raw) : undefined
  return parsed && Number.isFinite(parsed) && parsed > 0 ? parsed : 120
}

function getTokenInfo(
  address: string | undefined,
  symbol: string | undefined,
): TokenInfo {
  if (address) {
    const tokenInfo = NORMALIZED_TICKERS.get(address.toLowerCase())
    if (tokenInfo) return tokenInfo
  }

  if (symbol === 'ETH' && WETH_INFO) {
    return { ticker: 'ETH', decimals: 18, price: WETH_INFO.price }
  }

  throw new Error(
    `Missing ticker metadata for privacy asset ${symbol ?? address ?? 'unknown'}`,
  )
}

function isBalanceMetricSource(
  source: PrivacyMetricSource,
): source is Extract<
  PrivacyMetricSource,
  { type: 'nativeBalance' | 'erc20BalanceOf' }
> {
  return source.type === 'nativeBalance' || source.type === 'erc20BalanceOf'
}

function historyCursorKey(
  projectId: string,
  assetKey: string,
  bucketId: string,
  direction: 'deposit' | 'withdrawal',
): string {
  return `${projectId}::${assetKey}::${bucketId}::${direction}`
}

function bucketKey(projectId: string, assetKey: string, bucketId: string) {
  return `${projectId}::${assetKey}::${bucketId}`
}

function historyRowKey(
  projectId: string,
  assetKey: string,
  bucketId: string,
  timestamp: number,
) {
  return `${bucketKey(projectId, assetKey, bucketId)}::${timestamp}`
}

function bigintToNumber(value: bigint, decimals: number): number {
  if (decimals === 0) return Number(value)
  const divisor = 10n ** BigInt(decimals)
  const integer = value / divisor
  const fraction = value % divisor
  if (fraction === 0n) return Number(integer)
  const fractionDigits = fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '')
    .slice(0, 8)
  return Number(
    `${integer.toString()}.${fractionDigits === '' ? '0' : fractionDigits}`,
  )
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
