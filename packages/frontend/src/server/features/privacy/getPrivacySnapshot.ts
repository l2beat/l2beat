import { TICKERS } from '@l2beat/config/build/projects/tornado-cash/tornado-cash'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import {
  getAllPrivacyBucketRows,
  type PrivacyBucketRow,
} from './db/PrivacyBucketRepo'
import { getAllPrivacyHistoryRows } from './db/PrivacyHistoryRepo'
import { getPrivacyProjects } from './getPrivacyProjects'
import type {
  PrivacyAssetSnapshot,
  PrivacyBucketSnapshot,
  PrivacyProjectConfig,
  PrivacyProjectSnapshot,
  PrivacySnapshot,
} from './types'

interface TokenInfo {
  ticker: string
  decimals: number
  price: number | null
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

export async function getPrivacySnapshot(
  cache: InMemoryCache,
): Promise<PrivacySnapshot> {
  return await cache.get(
    {
      key: ['privacy', 'snapshot'],
      ttl: 60,
      staleWhileRevalidate: 5 * 60,
    },
    async () => {
      const projects = await getPrivacyProjects()
      const rows = getAllPrivacyBucketRows()
      const historyRows = getAllPrivacyHistoryRows()
      const rowIndex = indexRows(rows)
      const depositValue30dUsdByProject = indexDepositValue30dUsdByProject(
        projects,
        historyRows,
        UnixTime.now(),
      )

      const snapshots = projects.map((project) =>
        buildProjectSnapshot(
          project,
          rowIndex,
          depositValue30dUsdByProject.get(project.id.toString()) ?? 0,
        ),
      )

      const orderedProjects = snapshots.sort(
        (a, b) =>
          b.summary.totalValueSecuredUsd - a.summary.totalValueSecuredUsd,
      )

      return {
        generatedAt: new Date().toISOString(),
        projects: orderedProjects,
        overview: {
          projectCount: orderedProjects.length,
          totalValueSecuredUsd: sum(
            orderedProjects.map((p) => p.summary.totalValueSecuredUsd),
          ),
          deposits30d: sum(
            orderedProjects.map((p) => p.summary.deposits.last30d),
          ),
        },
      }
    },
  )
}

type RowIndex = Map<string, PrivacyBucketRow>

function indexRows(rows: PrivacyBucketRow[]): RowIndex {
  const index: RowIndex = new Map()
  for (const row of rows) {
    index.set(rowKey(row.projectId, row.assetKey, row.bucketId), row)
  }
  return index
}

function rowKey(projectId: string, assetKey: string, bucketId: string): string {
  return `${projectId}::${assetKey}::${bucketId}`
}

function buildProjectSnapshot(
  project: PrivacyProjectConfig,
  rowIndex: RowIndex,
  depositValue30dUsd: number,
): PrivacyProjectSnapshot {
  const projectId = project.id.toString()

  const assets = project.privacyInfo.assets.map((asset) =>
    buildAssetSnapshot(projectId, asset, rowIndex),
  )

  const orderedAssets = assets.sort((a, b) => {
    const valueDelta = (b.totalValueUsd ?? 0) - (a.totalValueUsd ?? 0)
    if (valueDelta !== 0) return valueDelta
    return a.symbol.localeCompare(b.symbol, undefined, { numeric: true })
  })

  const unpricedAssets = [
    ...new Set(
      orderedAssets
        .filter((asset) => asset.priceUsd === null && asset.totalAmount > 0)
        .map((asset) => asset.symbol),
    ),
  ]

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    display: project.display,
    contracts: project.contracts,
    permissions: project.permissions,
    statuses: project.statuses,
    trustedSetup: project.privacyInfo.trustedSetup,
    riskSummary: project.privacyInfo.riskSummary,
    upgradesAndGovernance: project.privacyInfo.upgradesAndGovernance,
    assets: orderedAssets,
    summary: {
      totalValueSecuredUsd: sum(
        orderedAssets.map((asset) => asset.totalValueUsd ?? 0),
      ),
      bucketCount: sum(orderedAssets.map((asset) => asset.bucketCount)),
      deposits: aggregateDeposits(orderedAssets),
      depositedValueUsd: {
        last30d: depositValue30dUsd,
      },
    },
    unpricedAssets,
  }
}

function buildAssetSnapshot(
  projectId: string,
  asset: PrivacyProjectConfig['privacyInfo']['assets'][number],
  rowIndex: RowIndex,
): PrivacyAssetSnapshot {
  const tokenInfo = getTokenInfo(asset.asset.address, asset.asset.symbol)
  const symbol = asset.asset.symbol ?? tokenInfo.ticker
  const assetKey = (asset.asset.address ?? symbol).toLowerCase()

  const buckets = asset.buckets.map((bucket) =>
    buildBucketSnapshot(
      projectId,
      assetKey,
      bucket,
      tokenInfo.decimals,
      rowIndex,
    ),
  )

  const totalAmount = sum(buckets.map((b) => b.totalAmount ?? 0))
  const totalValueUsd =
    tokenInfo.price === null ? null : totalAmount * tokenInfo.price

  return {
    symbol,
    address: asset.asset.address,
    decimals: tokenInfo.decimals,
    priceUsd: tokenInfo.price,
    bucketCount: buckets.length,
    totalAmount,
    totalValueUsd,
    deposits: aggregateDeposits(buckets),
    buckets: buckets.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { numeric: true }),
    ),
  }
}

function buildBucketSnapshot(
  projectId: string,
  assetKey: string,
  bucket: PrivacyProjectConfig['privacyInfo']['assets'][number]['buckets'][number],
  decimals: number,
  rowIndex: RowIndex,
): PrivacyBucketSnapshot {
  const row = rowIndex.get(rowKey(projectId, assetKey, bucket.id))

  const totalAmount =
    row?.totalValueAmount != null
      ? bigintToNumber(BigInt(row.totalValueAmount), decimals)
      : null
  const totalValueUsd =
    totalAmount === null || row?.priceUsd == null
      ? null
      : totalAmount * row.priceUsd

  return {
    id: bucket.id,
    label: bucket.label,
    type: bucket.type,
    denomination: bucket.denomination,
    totalAmount,
    totalValueUsd,
    deposits: {
      total: row?.depositsTotal ?? 0,
      last7d: row?.deposits7d ?? 0,
      last30d: row?.deposits30d ?? 0,
    },
  }
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

function aggregateDeposits(
  items: { deposits: { total: number; last7d: number; last30d: number } }[],
) {
  return {
    total: sum(items.map((i) => i.deposits.total)),
    last7d: sum(items.map((i) => i.deposits.last7d)),
    last30d: sum(items.map((i) => i.deposits.last30d)),
  }
}

function indexDepositValue30dUsdByProject(
  projects: PrivacyProjectConfig[],
  historyRows: ReturnType<typeof getAllPrivacyHistoryRows>,
  now: number,
): Map<string, number> {
  const bucketInfoByKey = new Map<
    string,
    { decimals: number; priceUsd: number | null }
  >()

  for (const project of projects) {
    const projectId = project.id.toString()
    for (const asset of project.privacyInfo.assets) {
      const tokenInfo = getTokenInfo(asset.asset.address, asset.asset.symbol)
      const assetKey = (
        asset.asset.address ??
        asset.asset.symbol ??
        tokenInfo.ticker
      ).toLowerCase()

      for (const bucket of asset.buckets) {
        bucketInfoByKey.set(rowKey(projectId, assetKey, bucket.id), {
          decimals: tokenInfo.decimals,
          priceUsd: tokenInfo.price,
        })
      }
    }
  }

  const result = new Map<string, number>()
  const last30dCutoff = UnixTime.toStartOf(now, 'day') - 29 * UnixTime.DAY

  for (const row of historyRows) {
    if (row.depositAmount === '0' || row.timestamp < last30dCutoff) {
      continue
    }

    const bucketInfo = bucketInfoByKey.get(
      rowKey(row.projectId, row.assetKey, row.bucketId),
    )
    if (!bucketInfo) continue

    const valueUsd = amountToUsd(
      BigInt(row.depositAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )

    result.set(row.projectId, (result.get(row.projectId) ?? 0) + valueUsd)
  }

  return result
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0)
}

function amountToUsd(
  amount: bigint,
  decimals: number,
  priceUsd: number | null,
): number {
  if (priceUsd === null) return 0
  return bigintToNumber(amount, decimals) * priceUsd
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
