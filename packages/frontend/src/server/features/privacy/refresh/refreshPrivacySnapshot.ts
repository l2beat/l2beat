import { Logger } from '@l2beat/backend-tools'
import type { PrivacyMetricSource } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import { executeEventExtract } from '@l2beat/config/build/privacy/executeEventExtract'
import { TICKERS } from '@l2beat/config/build/projects/tornado-cash/tornado-cash'
import {
  encodeErc20Balance,
  HttpClient,
  type IRpcClient,
  RpcClientCompat,
} from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  type PrivacyBucketRow,
  upsertManyPrivacyBucketRows,
} from '../db/PrivacyBucketRepo'
import { getPrivacyProjects } from '../getPrivacyProjects'
import type { PrivacyProjectConfig } from '../types'

type Log = Awaited<ReturnType<IRpcClient['getLogs']>>[number]

const RPC_CLIENTS = new Map<string, IRpcClient>()
const DISCOVERIES = new Map<string, ProjectDiscovery>()
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
  timestamp: number
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
      timestamp: Math.floor(Date.now() / 1000),
    }

    const batches = await Promise.all(
      projects.map((project) => collectProjectRows(project, context)),
    )

    const rows: PrivacyBucketRow[] = []
    const skipped: SkippedBucket[] = []
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

async function collectProjectRows(
  project: PrivacyProjectConfig,
  context: RefreshContext,
): Promise<{ rows: PrivacyBucketRow[]; skipped: SkippedBucket[] }> {
  const projectId = project.id.toString()
  const batches = await Promise.all(
    project.privacyInfo.assets.map((asset) =>
      collectAssetRows(project, projectId, asset, context),
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
  context: RefreshContext,
): Promise<PrivacyBucketRow> {
  const [rawTotalAmount, totalDeposits, last7dDeposits, last30dDeposits] =
    await Promise.all([
      bucket.totalValue
        ? getBucketTotalValue(project, bucket.totalValue, context)
        : Promise.resolve<bigint | null>(null),
      bucket.deposits.total
        ? evaluateDepositMetric(project, bucket.deposits.total, context)
        : Promise.resolve(0),
      bucket.deposits.last7d
        ? evaluateDepositMetric(project, bucket.deposits.last7d, context)
        : Promise.resolve(0),
      bucket.deposits.last30d
        ? evaluateDepositMetric(project, bucket.deposits.last30d, context)
        : Promise.resolve(0),
    ])

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
    depositsTotal: totalDeposits,
    deposits7d: last7dDeposits,
    deposits30d: last30dDeposits,
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

async function evaluateDepositMetric(
  project: PrivacyProjectConfig,
  source: PrivacyMetricSource,
  context: RefreshContext,
): Promise<number> {
  switch (source.type) {
    case 'discoveryValue': {
      const discovery = getProjectDiscovery(project.slug)
      const value = discovery.getContractValue(source.contract, source.key)
      return toCount(value)
    }
    case 'eventCount': {
      const logs = await getLogs(source, context)
      return logs.length
    }
    case 'eventExtract': {
      const logs = await getLogs(source, context)
      return executeEventExtract(source, logs)
    }
    default:
      throw new Error(`Unsupported deposit metric source: ${source.type}`)
  }
}

async function getLogs(
  source: Extract<PrivacyMetricSource, { type: 'eventCount' | 'eventExtract' }>,
  context: RefreshContext,
): Promise<Log[]> {
  const client = getRpcClient(source.chain)
  const toBlock = await getLatestBlockNumber(source.chain, client, context)
  const fromBlock = source.fromLastBlock
    ? Math.max(0, toBlock - Math.floor(source.fromLastBlock))
    : 0

  const addressArg = source.address
    ? ChainSpecificAddress.address(source.address).toString()
    : ''
  const key = `${source.chain}|${addressArg}|${source.event}|${fromBlock}|${toBlock}`

  const cached = context.logsByKey.get(key)
  if (cached) return cached

  const addresses = source.address
    ? [ChainSpecificAddress.address(source.address)]
    : undefined
  const promise = client.getLogs(fromBlock, toBlock, addresses, [source.event])
  context.logsByKey.set(key, promise)
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

function getProjectDiscovery(projectSlug: string): ProjectDiscovery {
  const cached = DISCOVERIES.get(projectSlug)
  if (cached) return cached
  const discovery = new ProjectDiscovery(projectSlug)
  DISCOVERIES.set(projectSlug, discovery)
  return discovery
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

function toCount(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'string') return Number(value)
  throw new Error(`Unsupported discovery metric value: ${String(value)}`)
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
