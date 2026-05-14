import type {
  ProjectContracts,
  ProjectDisplay,
  ProjectPermissions,
  ProjectStatuses,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { getPrivacyProjects } from './getPrivacyProjects'
import type { PrivacyAsset, PrivacyBucket } from './types'

export interface PrivacyProjectDetails {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  display: ProjectDisplay
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermissions>
  statuses: ProjectStatuses
  trustedSetup: {
    name: string
    risk: 'green' | 'yellow' | 'red' | 'N/A'
    shortDescription: string
    longDescription: string
    participantCount?: number
  }
  riskSummary?: string
  upgradesAndGovernance?: string
  assets: PrivacyAsset[]
  summary: {
    totalValueSecuredUsd: number
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
  }
}

export async function getPrivacyProjectDetails(
  slug: string,
): Promise<PrivacyProjectDetails | undefined> {
  const projects = await getPrivacyProjects()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return undefined
  }

  const db = getDb()
  const projectId = project.id.toString()

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 6 * UnixTime.DAY
  const last30dCutoff = currentDay - 29 * UnixTime.DAY

  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds([projectId]),
    db.privacyFlowEvent.getDailyByProjectIds(
      [projectId],
      last30dCutoff,
      currentDay,
    ),
    db.tvsTokenValue.getLastNonZeroValue(now, projectId),
  ])

  const tvsBySymbol = new Map<string, number>()
  for (const tv of tokenValues) {
    const tvsToken = project.tvsConfig?.find(
      (t: { id: string; symbol: string }) => t.id === tv.tokenId,
    )
    if (tvsToken) {
      const existing = tvsBySymbol.get(tvsToken.symbol) ?? 0
      tvsBySymbol.set(tvsToken.symbol, existing + tv.valueForProject)
    }
  }
  const projectTotalTvs = tokenValues.reduce(
    (sum, tv) => sum + tv.valueForProject,
    0,
  )

  const totalIndex = new Map<string, (typeof totals)[number]>()
  for (const total of totals) {
    totalIndex.set(`${total.projectId}::${total.bucketId}`, total)
  }

  const daily30dIndex = new Map<string, (typeof daily30d)[number]>()
  const daily7dIndex = new Map<string, (typeof daily30d)[number]>()
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
    const assetTvs = tvsBySymbol.get(symbol) ?? null

    const buckets = token.buckets.map((bucket) => {
      const key = `${projectId}::${bucket.id}`
      const total = totalIndex.get(key)
      const daily7d = daily7dIndex.get(key)
      const daily30d = daily30dIndex.get(key)

      return {
        id: bucket.id,
        label: bucket.label,
        type: bucket.type,
        denomination: bucket.denomination,
        totalAmount: null,
        totalValueUsd: null,
        deposits: {
          total: total?.depositCount ?? 0,
          last7d: daily7d?.depositCount ?? 0,
          last30d: daily30d?.depositCount ?? 0,
        },
        depositedValueUsd: {
          total: total?.depositValueUsd ?? 0,
          last7d: daily7d?.depositValueUsd ?? 0,
          last30d: daily30d?.depositValueUsd ?? 0,
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
      totalValueUsd: assetTvs,
      deposits: {
        total: sum(buckets.map((b) => b.deposits.total)),
        last7d: sum(buckets.map((b) => b.deposits.last7d)),
        last30d: sum(buckets.map((b) => b.deposits.last30d)),
      },
      depositedValueUsd: {
        total: sum(buckets.map((b) => b.depositedValueUsd.total)),
        last7d: sum(buckets.map((b) => b.depositedValueUsd.last7d)),
        last30d: sum(buckets.map((b) => b.depositedValueUsd.last30d)),
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
      totalValueSecuredUsd: projectTotalTvs,
      bucketCount: orderedAssets.reduce((sum, a) => sum + a.bucketCount, 0),
      deposits: {
        total: sum(orderedAssets.map((a) => a.deposits.total)),
        last7d: sum(orderedAssets.map((a) => a.deposits.last7d)),
        last30d: sum(orderedAssets.map((a) => a.deposits.last30d)),
      },
      depositedValueUsd: {
        total: sum(orderedAssets.map((a) => a.depositedValueUsd.total)),
        last7d: sum(orderedAssets.map((a) => a.depositedValueUsd.last7d)),
        last30d: sum(orderedAssets.map((a) => a.depositedValueUsd.last30d)),
      },
    },
  }
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0)
}
