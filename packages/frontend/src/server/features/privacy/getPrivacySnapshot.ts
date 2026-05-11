import type { PrivacyPriceRecord } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  amountToUsd,
  bigintToNumber,
  buildPrivacyBucketInfoByKey,
  getPrivacyBucketKey,
  type PrivacyBucketInfo,
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
      const db = getDb()
      const projects = await getPrivacyProjects()
      const projectIds = projects.map((p) => p.id.toString())

      const now = UnixTime.now()
      const currentDay = UnixTime.toStartOf(now, 'day')
      const last7dCutoff = currentDay - 6 * UnixTime.DAY
      const last30dCutoff = currentDay - 29 * UnixTime.DAY

      const [totals, daily30d] = await Promise.all([
        db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
        db.privacyFlowEvent.getDailyByProjectIds(
          projectIds,
          last30dCutoff,
          currentDay,
        ),
      ])

      const priceIds = new Set<string>()
      for (const project of projects) {
        for (const token of project.privacyInfo.tokens) {
          priceIds.add(token.token.priceId)
        }
      }

      const priceRecords = await Promise.all(
        Array.from(priceIds).map((priceId) =>
          db.privacyPrice.getLatestPriceByPriceId(priceId),
        ),
      )

      const priceById = new Map(
        priceRecords
          .filter((p): p is PrivacyPriceRecord => p !== undefined)
          .map((p) => [p.priceId, p.priceUsd]),
      )

      const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects, priceById)
      const totalIndex = indexBucketTotals(totals)
      const dailyIndex = indexDailyByBucket(daily30d)

      const snapshots = projects.map((project) =>
        buildProjectSnapshot(
          project,
          bucketInfoByKey,
          totalIndex,
          dailyIndex,
          last7dCutoff,
          last30dCutoff,
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

type BucketTotal = {
  projectId: string
  bucketId: string
  depositCount: number
  withdrawalCount: number
  depositAmount: bigint
  withdrawalAmount: bigint
}

type BucketTotalIndex = Map<string, BucketTotal>

function indexBucketTotals(totals: BucketTotal[]): BucketTotalIndex {
  const index = new Map<string, BucketTotal>()
  for (const total of totals) {
    index.set(getPrivacyBucketKey(total.projectId, total.bucketId), total)
  }
  return index
}

type DailyRow = {
  projectId: string
  bucketId: string
  timestamp: UnixTime
  depositCount: number
  withdrawalCount: number
  depositAmount: bigint
  withdrawalAmount: bigint
}

type DailyIndex = Map<string, DailyRow[]>

function indexDailyByBucket(dailyRows: DailyRow[]): DailyIndex {
  const index = new Map<string, DailyRow[]>()
  for (const row of dailyRows) {
    const key = getPrivacyBucketKey(row.projectId, row.bucketId)
    const existing = index.get(key) ?? []
    existing.push(row)
    index.set(key, existing)
  }
  return index
}

function buildProjectSnapshot(
  project: PrivacyProjectConfig,
  bucketInfoByKey: Map<string, PrivacyBucketInfo>,
  totalIndex: BucketTotalIndex,
  dailyIndex: DailyIndex,
  last7dCutoff: UnixTime,
  last30dCutoff: UnixTime,
): PrivacyProjectSnapshot {
  const projectId = project.id.toString()

  const assets = project.privacyInfo.tokens.map((token) =>
    buildAssetSnapshot(
      projectId,
      token,
      bucketInfoByKey,
      totalIndex,
      dailyIndex,
      last7dCutoff,
      last30dCutoff,
    ),
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
  token: PrivacyProjectConfig['privacyInfo']['tokens'][number],
  bucketInfoByKey: Map<string, PrivacyBucketInfo>,
  totalIndex: BucketTotalIndex,
  dailyIndex: DailyIndex,
  last7dCutoff: UnixTime,
  last30dCutoff: UnixTime,
): PrivacyAssetSnapshot {
  const symbol = token.token.symbol
  const priceUsd =
    bucketInfoByKey.get(
      getPrivacyBucketKey(projectId, token.buckets[0]?.id ?? ''),
    )?.priceUsd ?? null

  const buckets = token.buckets.map((bucket) =>
    buildBucketSnapshot(
      projectId,
      bucket,
      bucketInfoByKey,
      totalIndex,
      dailyIndex,
      last7dCutoff,
      last30dCutoff,
    ),
  )

  const totalAmount = sum(buckets.map((b) => b.totalAmount ?? 0))
  const totalValueUsd = priceUsd === null ? null : totalAmount * priceUsd

  return {
    symbol,
    address: token.token.address,
    decimals: token.token.decimals,
    priceUsd,
    bucketCount: buckets.length,
    totalAmount,
    totalValueUsd,
    deposits: aggregateDeposits(buckets),
    depositedValueUsd:
      priceUsd === null
        ? emptyDepositedValueUsd()
        : aggregateDepositedValueUsd(buckets),
    buckets: buckets.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { numeric: true }),
    ),
  }
}

function buildBucketSnapshot(
  projectId: string,
  bucket: PrivacyProjectConfig['privacyInfo']['tokens'][number]['buckets'][number],
  bucketInfoByKey: Map<string, PrivacyBucketInfo>,
  totalIndex: BucketTotalIndex,
  dailyIndex: DailyIndex,
  last7dCutoff: UnixTime,
  last30dCutoff: UnixTime,
): PrivacyBucketSnapshot {
  const key = getPrivacyBucketKey(projectId, bucket.id)
  const bucketInfo = bucketInfoByKey.get(key)
  const total = totalIndex.get(key)
  const dailyRows = dailyIndex.get(key) ?? []

  const depositAmount7d = dailyRows
    .filter((r) => r.timestamp >= last7dCutoff)
    .reduce((sum, r) => sum + r.depositAmount, 0n)
  const depositAmount30d = dailyRows
    .filter((r) => r.timestamp >= last30dCutoff)
    .reduce((sum, r) => sum + r.depositAmount, 0n)
  const depositCount7d = dailyRows
    .filter((r) => r.timestamp >= last7dCutoff)
    .reduce((sum, r) => sum + r.depositCount, 0)
  const depositCount30d = dailyRows
    .filter((r) => r.timestamp >= last30dCutoff)
    .reduce((sum, r) => sum + r.depositCount, 0)

  const totalAmount =
    total != null
      ? bigintToNumber(
          total.depositAmount - total.withdrawalAmount,
          bucketInfo?.decimals ?? 0,
        )
      : null

  const totalValueUsd =
    totalAmount === null || bucketInfo?.priceUsd == null
      ? null
      : totalAmount * bucketInfo.priceUsd

  return {
    id: bucket.id,
    label: bucket.label,
    type: bucket.type,
    denomination: bucket.denomination,
    totalAmount,
    totalValueUsd,
    deposits: {
      total: total?.depositCount ?? 0,
      last7d: depositCount7d,
      last30d: depositCount30d,
    },
    depositedValueUsd:
      bucketInfo?.priceUsd == null
        ? emptyDepositedValueUsd()
        : {
            total: amountToUsd(
              total?.depositAmount ?? 0n,
              bucketInfo.decimals,
              bucketInfo.priceUsd,
            ),
            last7d: amountToUsd(
              depositAmount7d,
              bucketInfo.decimals,
              bucketInfo.priceUsd,
            ),
            last30d: amountToUsd(
              depositAmount30d,
              bucketInfo.decimals,
              bucketInfo.priceUsd,
            ),
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
