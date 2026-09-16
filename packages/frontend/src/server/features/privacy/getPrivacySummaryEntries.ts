import type {
  PrivacyAttribute,
  PrivacyExitWindow,
  PrivacySummaryValue,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import {
  type PrivacyAdversariesSummary,
  type PrivacyProject,
  toPrivacyAdversariesSummary,
} from './types'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetup,
} from './utils/getPrivacyTrustedSetup'

export interface PrivacySummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  isTracked: boolean
  hasTvl: boolean
  totalValueLockedUsd?: number
  totalValueLockedChange7d?: number
  poolsTracked: number
  totalDeposits?: number
  totalValueDeposited30dUsd?: number
  isUnderReview: boolean
  summaryTrackedItemName: string
  trustedSetup: PrivacyTrustedSetup
  exitWindow: PrivacyExitWindow
  reproducibility: PrivacySummaryValue
  adversaries: PrivacyAdversariesSummary
  attributes: PrivacyAttribute[]
  quantumResistant?: boolean
}

type PrivacySummaryTrackingMetrics = Pick<
  PrivacySummaryEntry,
  | 'isTracked'
  | 'poolsTracked'
  | 'totalValueLockedUsd'
  | 'totalValueLockedChange7d'
  | 'totalDeposits'
  | 'totalValueDeposited30dUsd'
>

type PrivacySummaryBaseEntry = Omit<
  PrivacySummaryEntry,
  keyof PrivacySummaryTrackingMetrics
>

export async function getPrivacySummaryEntries(
  projects: PrivacyProject[],
): Promise<PrivacySummaryEntry[]> {
  if (env.MOCK) {
    return getMockPrivacySummaryEntries(projects)
  }

  const db = getDb()
  const projectIds = projects.map((p) => p.id)
  const tvlProjectIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((project) => project.id)

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const [totals, daily30d, tvl] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
    ),
    get7dTvsBreakdown({ type: 'projects', projectIds: tvlProjectIds }),
  ])

  const totalsByProject = groupBy(totals, (t) => t.projectId)
  const dailyByProject = groupBy(daily30d, (d) => d.projectId)

  const entries = projects.map((project): PrivacySummaryEntry => {
    const projectId = project.id
    const projectTotals = totalsByProject[projectId] ?? []
    const projectDaily = dailyByProject[projectId] ?? []
    const projectTvl = tvl.projects[projectId]
    const totalValueLockedUsd = projectTvl?.breakdown.total
    const totalValueLockedChange7d = projectTvl?.change.total
    const totalDeposits = projectTotals.reduce(
      (sum, t) => sum + t.depositCount,
      0,
    )
    const totalValueDeposited30dUsd = projectDaily.reduce(
      (sum, row) => sum + row.depositValueUsd,
      0,
    )

    return {
      ...getPrivacySummaryBaseEntry(project),
      ...getTrackingMetrics({
        poolsTracked: getPoolsTracked(project),
        totalValueLockedUsd,
        totalValueLockedChange7d,
        totalDeposits,
        totalValueDeposited30dUsd,
      }),
    }
  })

  return entries.sort(comparePrivacySummaryEntries)
}

function getMockPrivacySummaryEntries(
  projects: PrivacyProject[],
): PrivacySummaryEntry[] {
  return projects
    .map((project): PrivacySummaryEntry => {
      return {
        ...getPrivacySummaryBaseEntry(project),
        ...getTrackingMetrics({
          poolsTracked: getPoolsTracked(project),
          totalValueLockedUsd:
            project.tvsConfig === undefined
              ? undefined
              : Math.random() * 1_000_000_000,
          totalValueLockedChange7d: project.tvsConfig ? 0.12 : undefined,
          totalDeposits: Math.round(Math.random() * 10_000),
          totalValueDeposited30dUsd: Math.random() * 100_000_000,
        }),
      }
    })
    .sort(comparePrivacySummaryEntries)
}

function getPrivacySummaryBaseEntry(
  project: PrivacyProject,
): PrivacySummaryBaseEntry {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    href: `/privacy/projects/${project.slug}`,
    description: project.display.description,
    hasTvl: project.tvsConfig !== undefined,
    isUnderReview: !!project.statuses.reviewStatus,
    summaryTrackedItemName:
      project.privacyInfo.summaryTrackedItemName ?? 'pool',
    trustedSetup: getPrivacyTrustedSetup(project.trustedSetups),
    exitWindow: project.privacyInfo.exitWindow,
    reproducibility: project.privacyInfo.reproducibility,
    adversaries: toPrivacyAdversariesSummary(project.privacyInfo.adversaries),
    attributes: project.privacyInfo.attributes ?? [],
    quantumResistant: project.privacyInfo.quantumResistant,
  }
}

function getTrackingMetrics(
  metrics: Omit<PrivacySummaryTrackingMetrics, 'isTracked'>,
): PrivacySummaryTrackingMetrics {
  if (metrics.poolsTracked === 0) {
    return {
      isTracked: false,
      poolsTracked: metrics.poolsTracked,
      totalValueLockedUsd: metrics.totalValueLockedUsd,
      totalValueLockedChange7d: metrics.totalValueLockedChange7d,
    }
  }

  return {
    isTracked: true,
    ...metrics,
  }
}

function getPoolsTracked(project: PrivacyProject): number {
  return project.privacyInfo.tokens.reduce(
    (sum, token) => sum + token.buckets.length,
    0,
  )
}

function comparePrivacySummaryEntries(
  a: PrivacySummaryEntry,
  b: PrivacySummaryEntry,
): number {
  if (a.isTracked !== b.isTracked) {
    return a.isTracked ? -1 : 1
  }

  if (a.hasTvl !== b.hasTvl) {
    return a.hasTvl ? -1 : 1
  }

  return (b.totalValueLockedUsd ?? 0) - (a.totalValueLockedUsd ?? 0)
}
