import type {
  PrivacyCategory,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectRedWarning,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { sortTableValues } from '~/components/table/sorting/sortTableValues'
import {
  getRowBackgroundColor,
  type RowBackgroundColor,
} from '~/components/table/utils/rowType'
import { env } from '~/env'
import { getPrivacyAdversariesTableValue } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import {
  getPrivacyAnonymitySetSummaries,
  type PrivacyAnonymitySetSummary,
} from './anonymity-set/getPrivacyAnonymitySetSummaries'
import type { PrivacyAdversariesSummary, PrivacyProject } from './types'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetup,
} from './utils/getPrivacyTrustedSetup'
import { toPrivacyAdversariesSummary } from './utils/toPrivacyAdversariesSummary'

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
  poolsTracked: number
  totalValueDeposited30dUsd?: number
  anonymitySet: PrivacyAnonymitySetSummary
  isUnderReview: boolean
  redWarning?: ProjectRedWarning
  backgroundColor: RowBackgroundColor
  category: PrivacyCategory
  trustedSetup: PrivacyTrustedSetup
  exitWindow: PrivacyExitWindow
  reproducibility: PrivacySummaryValue
  adversaries: PrivacyAdversariesSummary
}

type PrivacySummaryTrackingMetrics = Pick<
  PrivacySummaryEntry,
  | 'isTracked'
  | 'poolsTracked'
  | 'totalValueLockedUsd'
  | 'totalValueDeposited30dUsd'
  | 'anonymitySet'
>

type PrivacySummaryBaseEntry = Omit<
  PrivacySummaryEntry,
  keyof PrivacySummaryTrackingMetrics
>

export async function getPrivacySummaryEntries(
  projects: PrivacyProject[],
): Promise<PrivacySummaryEntry[]> {
  const currentDay = UnixTime.toStartOf(UnixTime.now(), 'day')

  if (env.MOCK) {
    return getMockPrivacySummaryEntries(projects, currentDay)
  }

  const db = getDb()
  const projectIds = projects.map((p) => p.id)
  const tvlProjectIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((project) => project.id)

  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const [daily30d, tvl, anonymitySets] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
    ),
    get7dTvsBreakdown({ type: 'projects', projectIds: tvlProjectIds }),
    getPrivacyAnonymitySetSummaries(projects, currentDay),
  ])

  const dailyByProject = groupBy(daily30d, (d) => d.projectId)

  const entries = projects.map((project): PrivacySummaryEntry => {
    const projectId = project.id
    const projectDaily = dailyByProject[projectId] ?? []
    const totalValueLockedUsd = tvl.projects[projectId]?.breakdown.total
    const totalValueDeposited30dUsd = projectDaily.reduce(
      (sum, row) => sum + row.depositValueUsd,
      0,
    )

    return {
      ...getPrivacySummaryBaseEntry(project),
      ...getTrackingMetrics({
        poolsTracked: getPoolsTracked(project),
        totalValueLockedUsd,
        totalValueDeposited30dUsd,
        anonymitySet: anonymitySets.get(projectId) ?? {
          status: 'unavailable',
        },
      }),
    }
  })

  return entries.sort(comparePrivacySummaryEntries)
}

async function getMockPrivacySummaryEntries(
  projects: PrivacyProject[],
  currentDay: UnixTime,
): Promise<PrivacySummaryEntry[]> {
  const anonymitySets = await getPrivacyAnonymitySetSummaries(
    projects,
    currentDay,
  )

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
          totalValueDeposited30dUsd: Math.random() * 100_000_000,
          anonymitySet: anonymitySets.get(project.id) ?? {
            status: 'unavailable',
          },
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
    redWarning: project.statuses.redWarning,
    backgroundColor: getRowBackgroundColor({
      redWarning: project.statuses.redWarning,
    }),
    category: project.privacyInfo.category,
    trustedSetup: getPrivacyTrustedSetup(project.trustedSetups),
    exitWindow: project.privacyInfo.exitWindow,
    reproducibility: project.privacyInfo.reproducibility,
    adversaries: toPrivacyAdversariesSummary(project.privacyInfo.adversaries),
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
      anonymitySet: metrics.anonymitySet,
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

/** Sorts by privacy. */
function comparePrivacySummaryEntries(
  a: PrivacySummaryEntry,
  b: PrivacySummaryEntry,
): number {
  const byPrivacy = sortTableValues(
    getPrivacyAdversariesTableValue(b.adversaries),
    getPrivacyAdversariesTableValue(a.adversaries),
  )
  if (byPrivacy !== 0) {
    return byPrivacy
  }

  if (a.isTracked !== b.isTracked) {
    return a.isTracked ? -1 : 1
  }

  if (a.hasTvl !== b.hasTvl) {
    return a.hasTvl ? -1 : 1
  }

  return (b.totalValueLockedUsd ?? 0) - (a.totalValueLockedUsd ?? 0)
}
