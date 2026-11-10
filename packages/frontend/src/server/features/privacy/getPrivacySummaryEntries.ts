import type {
  PrivacyCategory,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectRedWarning,
} from '@l2beat/config'
import { UnixTime, unique } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { SectionChain } from '~/components/projects/sections/SectionChainBadge'
import { sortTableValues } from '~/components/table/sorting/sortTableValues'
import {
  getRowBackgroundColor,
  type RowBackgroundColor,
} from '~/components/table/utils/rowType'
import { env } from '~/env'
import { getPrivacyAdversariesTableValue } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { PROJECT_PAGE_METADATA_FIELDS } from '~/utils/project/getProjectUrl'
import { get7dTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import {
  getPrivacyAnonymitySetSummaries,
  type PrivacyAnonymitySetSummary,
} from './anonymity-set/getPrivacyAnonymitySetSummaries'
import {
  getPrivacyChainValues,
  hasPrivacyValueLocked,
} from './getPrivacyValueLockedChart'
import type { PrivacyAdversariesSummary, PrivacyProject } from './types'
import { getPrivacyFlowBuckets } from './utils/getPrivacyFlowSync'
import {
  getPrivacyProjectPages,
  getPrivacyProjectPath,
  type PrivacyProjectPage,
} from './utils/getPrivacyProjectPages'
import { getPrivacyTrackedChains } from './utils/getPrivacyTrackedChains'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetup,
} from './utils/getPrivacyTrustedSetup'
import { toPrivacyAdversariesSummary } from './utils/toPrivacyAdversariesSummary'

export interface PrivacySummaryEntry {
  /** The project's id. A project with a page per chain has an entry per chain. */
  id: string
  slug: string
  /** The chain the entry is about, for a project with a page per chain. */
  chain?: SectionChain
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
  quantumResistant?: boolean
}

type PrivacySummaryTrackingMetrics = Pick<
  PrivacySummaryEntry,
  | 'isTracked'
  | 'poolsTracked'
  | 'totalValueLockedUsd'
  | 'totalValueLockedChange7d'
  | 'totalValueDeposited30dUsd'
  | 'anonymitySet'
>

type PrivacySummaryBaseEntry = Omit<
  PrivacySummaryEntry,
  keyof PrivacySummaryTrackingMetrics
>

/**
 * @param entryPer `page` gives a project with a page per chain an entry per
 *   chain. `project` gives it one, with the figures of all its chains.
 */
export async function getPrivacySummaryEntries(
  projects: PrivacyProject[],
  entryPer: 'page' | 'project' = 'page',
): Promise<PrivacySummaryEntry[]> {
  const currentDay = UnixTime.toStartOf(UnixTime.now(), 'day')
  const pages =
    entryPer === 'page'
      ? projects.flatMap(getPrivacyProjectPages)
      : projects.map(
          (project): PrivacyProjectPage<PrivacyProject> => ({
            project,
            path: getPrivacyProjectPath(project.slug),
          }),
        )
  const pageProjects = pages.map((page) => page.project)
  const chains = await getPageChains(pages)

  if (env.MOCK) {
    const anonymitySets = await getPrivacyAnonymitySetSummaries(
      pageProjects,
      currentDay,
    )
    return pages
      .map((page): PrivacySummaryEntry => {
        const base = getPrivacySummaryBaseEntry(page, chains)
        return {
          ...base,
          ...getTrackingMetrics({
            poolsTracked: getPoolsTracked(page.project),
            totalValueLockedUsd: base.hasTvl
              ? Math.random() * 1_000_000_000
              : undefined,
            totalValueLockedChange7d: base.hasTvl
              ? Math.random() * 0.4 - 0.2
              : undefined,
            totalValueDeposited30dUsd: Math.random() * 100_000_000,
            anonymitySet: anonymitySets.get(page.project) ?? {
              status: 'unavailable',
            },
          }),
        }
      })
      .sort(comparePrivacySummaryEntries)
  }

  const db = getDb()
  const projectIds = projects.map((p) => p.id)
  const tvlProjectIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((project) => project.id)

  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const [daily30d, tvl, anonymitySets, chainValues] = await Promise.all([
    db.privacyFlowEvent.getBucketedByProjectIds(
      projectIds,
      last30dCutoff,
      currentDay,
      'day',
    ),
    get7dTvsBreakdown({ type: 'projects', projectIds: tvlProjectIds }),
    getPrivacyAnonymitySetSummaries(pageProjects, currentDay),
    getChainValuesByProject(pages),
  ])

  const dailyByProject = groupBy(daily30d, (d) => d.projectId)

  const entries = pages.map((page): PrivacySummaryEntry => {
    const { project, chain } = page
    const projectId = project.id
    // A chain's page counts the deposits into its own buckets.
    const bucketIds = new Set(
      getPrivacyFlowBuckets([project]).map((bucket) => bucket.id),
    )
    const totalValueDeposited30dUsd = (dailyByProject[projectId] ?? [])
      .filter((row) => chain === undefined || bucketIds.has(row.bucketId))
      .reduce((sum, row) => sum + row.depositValueUsd, 0)
    const value =
      chain === undefined
        ? {
            value: tvl.projects[projectId]?.breakdown.total,
            change7d: tvl.projects[projectId]?.change.total,
          }
        : chainValues.get(projectId)?.get(chain)

    return {
      ...getPrivacySummaryBaseEntry(page, chains),
      ...getTrackingMetrics({
        poolsTracked: getPoolsTracked(project),
        totalValueLockedUsd: value?.value,
        totalValueLockedChange7d: value?.change7d,
        totalValueDeposited30dUsd,
        anonymitySet: anonymitySets.get(project) ?? {
          status: 'unavailable',
        },
      }),
    }
  })

  return entries.sort(comparePrivacySummaryEntries)
}

/** Name and icon of every chain that has a page of its own. */
async function getPageChains(
  pages: PrivacyProjectPage<PrivacyProject>[],
): Promise<Map<string, SectionChain>> {
  const names = unique(pages.flatMap((page) => page.chain ?? []))
  if (names.length === 0) return new Map()
  const chainProjects = await ps.getProjects({
    select: ['chainConfig'],
    optional: [...PROJECT_PAGE_METADATA_FIELDS],
  })
  return new Map(
    getPrivacyTrackedChains(names, chainProjects).map(
      ({ id, name, iconUrl }) => [id, { id, name, iconUrl }],
    ),
  )
}

/** The value locked on each chain of the projects that have a page per chain. */
async function getChainValuesByProject(
  pages: PrivacyProjectPage<PrivacyProject>[],
) {
  const chainsByProject = groupBy(
    pages.filter((page) => page.chain !== undefined),
    (page) => page.project.id,
  )
  const entries = await Promise.all(
    Object.entries(chainsByProject).map(
      async ([projectId, projectPages]) =>
        [
          projectId,
          await getPrivacyChainValues(
            projectId,
            projectPages[0]?.project.tvsConfig ?? [],
            projectPages.flatMap((page) => page.chain ?? []),
          ),
        ] as const,
    ),
  )
  return new Map(entries)
}

function getPrivacySummaryBaseEntry(
  { project, chain, path }: PrivacyProjectPage<PrivacyProject>,
  chains: Map<string, SectionChain>,
): PrivacySummaryBaseEntry {
  return {
    id: project.id,
    slug: project.slug,
    chain: chain === undefined ? undefined : chains.get(chain),
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    href: path,
    description: project.display.description,
    hasTvl: hasPrivacyValueLocked(project.tvsConfig, chain),
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
