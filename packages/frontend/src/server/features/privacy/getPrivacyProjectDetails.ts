import type {
  PrivacyAttribute,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectContracts,
  ProjectDisplay,
  ProjectPermissions,
  ProjectPrivacyRelayers,
  ProjectStatuses,
  ProjectZkCatalogInfo,
} from '@l2beat/config'
import type {
  PrivacyFlowBucketTotalRecord,
  PrivacyFlowDailyRecord,
  TokenValueRecord,
} from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { PrivacyAsset, PrivacyBucket, PrivacyProject } from './types'

interface PrivacyProjectFlowData {
  totals: PrivacyFlowBucketTotalRecord[]
  daily30d: PrivacyFlowDailyRecord[]
  tokenValues: TokenValueRecord[]
}

export interface PrivacyProjectDetails {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  display: ProjectDisplay
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermissions>
  statuses: ProjectStatuses
  zkCatalogInfo?: ProjectZkCatalogInfo
  exitWindow: PrivacyExitWindow
  privacy: PrivacySummaryValue
  reproducibility: PrivacySummaryValue
  riskSummary?: string
  upgradesAndGovernance?: string
  attributes: PrivacyAttribute[]
  assets: PrivacyAsset[]
  summary: {
    bucketCount: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
    depositedValueUsd: {
      total: number
      last7d: number
      last30d: number
    }
    relayers?: ProjectPrivacyRelayers
  }
}

export async function getPrivacyProjectDetails(
  slug: string,
): Promise<PrivacyProjectDetails | undefined> {
  const project = await ps.getProject({
    slug,
    where: ['privacyInfo'],
    select: ['display', 'privacyInfo', 'statuses'],
    optional: [
      'tvsConfig',
      'contracts',
      'permissions',
      'discoveryInfo',
      'zkCatalogInfo',
    ],
  })
  if (!project) {
    return undefined
  }

  const projectId = project.id

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 7 * UnixTime.DAY
  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const { totals, daily30d, tokenValues } = await getPrivacyProjectFlowData(
    project,
    last30dCutoff,
    currentDay,
    now,
  )

  const tvlBySymbol = new Map<string, number>()
  for (const tv of tokenValues) {
    const tvlToken = project.tvsConfig?.find(
      (t: { id: string; symbol: string }) => t.id === tv.tokenId,
    )
    if (tvlToken) {
      const existing = tvlBySymbol.get(tvlToken.symbol) ?? 0
      tvlBySymbol.set(tvlToken.symbol, existing + tv.valueForProject)
    }
  }
  const totalIndex = new Map<string, PrivacyFlowBucketTotalRecord>()
  for (const total of totals) {
    totalIndex.set(`${total.projectId}::${total.bucketId}`, total)
  }

  const daily30dIndex = new Map<string, PrivacyFlowDailyRecord>()
  const daily7dIndex = new Map<string, PrivacyFlowDailyRecord>()
  for (const row of daily30d) {
    const key = `${row.projectId}::${row.bucketId}`
    const base = {
      projectId: row.projectId,
      bucketId: row.bucketId,
      timestamp: row.timestamp,
      depositCount: 0,
      withdrawalCount: 0,
      depositAmount: 0n,
      withdrawalAmount: 0n,
      depositValueUsd: 0,
      withdrawalValueUsd: 0,
    }

    const existing30d = daily30dIndex.get(key) ?? { ...base }
    existing30d.depositCount += row.depositCount
    existing30d.withdrawalCount += row.withdrawalCount
    existing30d.depositAmount += row.depositAmount
    existing30d.withdrawalAmount += row.withdrawalAmount
    existing30d.depositValueUsd += row.depositValueUsd
    existing30d.withdrawalValueUsd += row.withdrawalValueUsd
    daily30dIndex.set(key, existing30d)

    if (row.timestamp >= last7dCutoff) {
      const existing7d = daily7dIndex.get(key) ?? { ...base }
      existing7d.depositCount += row.depositCount
      existing7d.withdrawalCount += row.withdrawalCount
      existing7d.depositAmount += row.depositAmount
      existing7d.withdrawalAmount += row.withdrawalAmount
      existing7d.depositValueUsd += row.depositValueUsd
      existing7d.withdrawalValueUsd += row.withdrawalValueUsd
      daily7dIndex.set(key, existing7d)
    }
  }

  const assets = project.privacyInfo.tokens.map((token) => {
    const symbol = token.token.symbol
    const assetTvl = tvlBySymbol.get(symbol) ?? null

    let assetDepositsTotal = 0
    let assetDeposits7d = 0
    let assetDeposits30d = 0
    let assetValueTotal = 0
    let assetValue7d = 0
    let assetValue30d = 0

    const buckets = token.buckets.map((bucket) => {
      const key = `${projectId}::${bucket.id}`
      const total = totalIndex.get(key)
      const daily7d = daily7dIndex.get(key)
      const daily30d = daily30dIndex.get(key)

      const depositCountTotal = total?.depositCount ?? 0
      const depositCount7d = daily7d?.depositCount ?? 0
      const depositCount30d = daily30d?.depositCount ?? 0
      const depositValueTotal = total?.depositValueUsd ?? 0
      const depositValue7d = daily7d?.depositValueUsd ?? 0
      const depositValue30d = daily30d?.depositValueUsd ?? 0

      assetDepositsTotal += depositCountTotal
      assetDeposits7d += depositCount7d
      assetDeposits30d += depositCount30d
      assetValueTotal += depositValueTotal
      assetValue7d += depositValue7d
      assetValue30d += depositValue30d

      return {
        id: bucket.id,
        label: bucket.label,
        type: bucket.type,
        denomination: bucket.denomination,
        totalAmount: null,
        totalValueUsd: null,
        deposits: {
          total: depositCountTotal,
          last7d: depositCount7d,
          last30d: depositCount30d,
        },
        depositedValueUsd: {
          total: depositValueTotal,
          last7d: depositValue7d,
          last30d: depositValue30d,
        },
      } satisfies PrivacyBucket
    })

    return {
      symbol,
      iconUrl: token.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      address: token.token.address,
      decimals: token.token.decimals,
      bucketCount: buckets.length,
      totalAmount: 0,
      totalValueUsd: assetTvl,
      deposits: {
        total: assetDepositsTotal,
        last7d: assetDeposits7d,
        last30d: assetDeposits30d,
      },
      depositedValueUsd: {
        total: assetValueTotal,
        last7d: assetValue7d,
        last30d: assetValue30d,
      },
      buckets: buckets.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true }),
      ),
    } satisfies PrivacyAsset
  })

  const orderedAssets = assets.sort((a, b) => {
    const valueDelta = (b.totalValueUsd ?? 0) - (a.totalValueUsd ?? 0)
    if (valueDelta !== 0) return valueDelta
    return a.symbol.localeCompare(b.symbol, undefined, { numeric: true })
  })

  let summaryBucketCount = 0
  let summaryDepositsTotal = 0
  let summaryDeposits7d = 0
  let summaryDeposits30d = 0
  let summaryValueTotal = 0
  let summaryValue7d = 0
  let summaryValue30d = 0

  for (const asset of orderedAssets) {
    summaryBucketCount += asset.bucketCount
    summaryDepositsTotal += asset.deposits.total
    summaryDeposits7d += asset.deposits.last7d
    summaryDeposits30d += asset.deposits.last30d
    summaryValueTotal += asset.depositedValueUsd.total
    summaryValue7d += asset.depositedValueUsd.last7d
    summaryValue30d += asset.depositedValueUsd.last30d
  }

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    display: project.display,
    contracts: project.contracts,
    permissions: project.permissions,
    statuses: project.statuses,
    zkCatalogInfo: project.zkCatalogInfo,
    exitWindow: project.privacyInfo.exitWindow,
    privacy: project.privacyInfo.privacy,
    reproducibility: project.privacyInfo.reproducibility,
    riskSummary: project.privacyInfo.riskSummary,
    upgradesAndGovernance: project.privacyInfo.upgradesAndGovernance,
    attributes: project.privacyInfo.attributes ?? [],
    assets: orderedAssets,
    summary: {
      bucketCount: summaryBucketCount,
      deposits: {
        total: summaryDepositsTotal,
        last7d: summaryDeposits7d,
        last30d: summaryDeposits30d,
      },
      depositedValueUsd: {
        total: summaryValueTotal,
        last7d: summaryValue7d,
        last30d: summaryValue30d,
      },
      relayers: project.privacyInfo.relayers,
    },
  }
}

async function getPrivacyProjectFlowData(
  project: PrivacyProject,
  from: UnixTime,
  to: UnixTime,
  now: UnixTime,
): Promise<PrivacyProjectFlowData> {
  const projectId = project.id

  if (env.MOCK) {
    return getMockPrivacyProjectFlowData(project, from, to)
  }

  const db = getDb()
  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds([projectId]),
    db.privacyFlowEvent.getDailyByProjectIds([projectId], from, to),
    db.tvsTokenValue.getLastNonZeroValue(now, projectId),
  ])
  return { totals, daily30d, tokenValues }
}

function getMockPrivacyProjectFlowData(
  project: PrivacyProject,
  from: UnixTime,
  to: UnixTime,
): PrivacyProjectFlowData {
  const projectId = project.id
  const bucketIds = project.privacyInfo.tokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const tokenIds = (project.tvsConfig ?? []).map((token) => token.id)

  const totals = bucketIds.map(
    (bucketId): PrivacyFlowBucketTotalRecord => ({
      projectId,
      bucketId,
      depositCount: Math.round(Math.random() * 5000),
      withdrawalCount: Math.round(Math.random() * 5000),
      depositAmount: 0n,
      withdrawalAmount: 0n,
      depositValueUsd: Math.random() * 10_000_000,
      withdrawalValueUsd: Math.random() * 10_000_000,
    }),
  )

  const daily30d: PrivacyFlowDailyRecord[] = []
  for (let timestamp = from; timestamp <= to; timestamp += UnixTime.DAY) {
    for (const bucketId of bucketIds) {
      daily30d.push({
        projectId,
        bucketId,
        timestamp: UnixTime(timestamp),
        depositCount: Math.round(Math.random() * 100),
        withdrawalCount: Math.round(Math.random() * 100),
        depositAmount: 0n,
        withdrawalAmount: 0n,
        depositValueUsd: Math.random() * 100_000,
        withdrawalValueUsd: Math.random() * 100_000,
      })
    }
  }

  const tokenValues = tokenIds.map(
    (tokenId): TokenValueRecord => ({
      timestamp: to,
      configurationId: tokenId,
      projectId,
      tokenId,
      amount: 0,
      value: 0,
      valueForProject: Math.random() * 5_000_000,
      valueForSummary: 0,
      priceUsd: 0,
    }),
  )

  return { totals, daily30d, tokenValues }
}
