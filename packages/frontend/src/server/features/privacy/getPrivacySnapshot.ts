import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import {
  getAllPrivacyBucketRows,
  type PrivacyBucketRow,
} from './db/PrivacyBucketRepo'
import { getAllPrivacyHistoryRows } from './db/PrivacyHistoryRepo'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  amountToUsd,
  bigintToNumber,
  buildPrivacyBucketInfoByKey,
  getPrivacyBucketKey,
  getPrivacyTokenInfo,
} from './privacyUtils'
import type {
  PrivacyAssetSnapshot,
  PrivacyBucketSnapshot,
  PrivacyDepositedValueUsd,
  PrivacyProjectConfig,
  PrivacyProjectSnapshot,
  PrivacySnapshot,
} from './types'

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
      const depositedValueUsdByBucket = indexDepositedValueUsdByBucket(
        projects,
        historyRows,
        UnixTime.now(),
      )

      const snapshots = projects.map((project) =>
        buildProjectSnapshot(project, rowIndex, depositedValueUsdByBucket),
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
  return getPrivacyBucketKey(projectId, assetKey, bucketId)
}

function buildProjectSnapshot(
  project: PrivacyProjectConfig,
  rowIndex: RowIndex,
  depositedValueUsdByBucket: Map<string, NonNullableDepositedValueUsd>,
): PrivacyProjectSnapshot {
  const projectId = project.id.toString()

  const assets = project.privacyInfo.assets.map((asset) =>
    buildAssetSnapshot(projectId, asset, rowIndex, depositedValueUsdByBucket),
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
      depositedValueUsd: aggregateDepositedValueUsd(orderedAssets),
    },
    unpricedAssets,
  }
}

function buildAssetSnapshot(
  projectId: string,
  asset: PrivacyProjectConfig['privacyInfo']['assets'][number],
  rowIndex: RowIndex,
  depositedValueUsdByBucket: Map<string, NonNullableDepositedValueUsd>,
): PrivacyAssetSnapshot {
  const tokenInfo = getPrivacyTokenInfo(asset.asset.address, asset.asset.symbol)
  const symbol = asset.asset.symbol ?? tokenInfo.ticker
  const assetKey = (asset.asset.address ?? symbol).toLowerCase()

  const buckets = asset.buckets.map((bucket) =>
    buildBucketSnapshot(
      projectId,
      assetKey,
      bucket,
      tokenInfo.decimals,
      rowIndex,
      tokenInfo.price,
      depositedValueUsdByBucket,
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
    depositedValueUsd:
      tokenInfo.price === null
        ? emptyDepositedValueUsd()
        : aggregateDepositedValueUsd(buckets),
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
  priceUsd: number | null,
  depositedValueUsdByBucket: Map<string, NonNullableDepositedValueUsd>,
): PrivacyBucketSnapshot {
  const row = rowIndex.get(rowKey(projectId, assetKey, bucket.id))
  const depositedValueUsd = depositedValueUsdByBucket.get(
    rowKey(projectId, assetKey, bucket.id),
  )

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
    depositedValueUsd:
      priceUsd === null
        ? emptyDepositedValueUsd()
        : {
            total: depositedValueUsd?.total ?? 0,
            last7d: depositedValueUsd?.last7d ?? 0,
            last30d: depositedValueUsd?.last30d ?? 0,
          },
  }
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

function aggregateDepositedValueUsd(
  items: { depositedValueUsd: PrivacyDepositedValueUsd }[],
): NonNullableDepositedValueUsd {
  return {
    total: sum(items.map((i) => i.depositedValueUsd.total ?? 0)),
    last7d: sum(items.map((i) => i.depositedValueUsd.last7d ?? 0)),
    last30d: sum(items.map((i) => i.depositedValueUsd.last30d ?? 0)),
  }
}

interface NonNullableDepositedValueUsd {
  total: number
  last7d: number
  last30d: number
}

function indexDepositedValueUsdByBucket(
  projects: PrivacyProjectConfig[],
  historyRows: ReturnType<typeof getAllPrivacyHistoryRows>,
  now: number,
): Map<string, NonNullableDepositedValueUsd> {
  const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects)

  const byBucket = new Map<string, NonNullableDepositedValueUsd>()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 6 * UnixTime.DAY
  const last30dCutoff = currentDay - 29 * UnixTime.DAY

  for (const row of historyRows) {
    if (row.depositAmount === '0') {
      continue
    }

    const key = rowKey(row.projectId, row.assetKey, row.bucketId)
    const bucketInfo = bucketInfoByKey.get(key)
    if (!bucketInfo) continue

    const valueUsd = amountToUsd(
      BigInt(row.depositAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )

    const entry = byBucket.get(key) ?? {
      total: 0,
      last7d: 0,
      last30d: 0,
    }

    entry.total += valueUsd
    if (row.timestamp >= last7dCutoff) {
      entry.last7d += valueUsd
    }
    if (row.timestamp >= last30dCutoff) {
      entry.last30d += valueUsd
    }

    byBucket.set(key, entry)
  }

  return byBucket
}

function emptyDepositedValueUsd(): PrivacyDepositedValueUsd {
  return {
    total: null,
    last7d: null,
    last30d: null,
  }
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0)
}
