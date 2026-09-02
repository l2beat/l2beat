import type { Project, ProjectDefiCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import { getDefiTvlDataSource } from './getDefiTvlDataSource'
import {
  type DefiDependency,
  type DefiDependencyProject,
  getDefiDependencyProjectsById,
  resolveDefiDependencies,
} from './resolveDefiDependencies'

export type DefiProject = Project<
  'display' | 'defiInfo' | 'statuses',
  'externalDependencies' | 'tvsConfig'
>

export interface DefiSummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  category: ProjectDefiCategory
  totalValueLockedUsd?: number
  tvlDataSource?: string
  dependencies?: DefiDependency[]
  isUnderReview: boolean
}

export async function getDefiSummaryEntries(
  projects: DefiProject[],
): Promise<DefiSummaryEntry[]> {
  const [tvlByProject, dependencyProjectsById] = await Promise.all([
    getTotalValueLockedByProject(projects),
    getDefiDependencyProjectsById(
      projects.flatMap((project) => project.externalDependencies ?? []),
    ),
  ])
  return buildDefiSummaryEntries(projects, tvlByProject, dependencyProjectsById)
}

export function buildDefiSummaryEntries(
  projects: DefiProject[],
  tvlByProject: ReadonlyMap<string, number>,
  dependencyProjectsById: ReadonlyMap<string, DefiDependencyProject>,
): DefiSummaryEntry[] {
  return projects
    .map((project): DefiSummaryEntry => {
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: `/defi/projects/${project.slug}`,
        description: project.display.description,
        category: project.defiInfo.category,
        totalValueLockedUsd: tvlByProject.get(project.id),
        tvlDataSource: project.defiInfo.tvl
          ? getDefiTvlDataSource(project.defiInfo.tvl).name
          : undefined,
        dependencies:
          project.externalDependencies !== undefined
            ? resolveDefiDependencies(
                project.externalDependencies,
                dependencyProjectsById,
              )
            : undefined,
        isUnderReview: !!project.statuses.reviewStatus,
      }
    })
    .sort(compareDefiSummaryEntries)
}

async function getTotalValueLockedByProject(
  projects: DefiProject[],
): Promise<Map<string, number>> {
  const l2beatIds = projects
    .filter((project) => project.defiInfo.tvl?.source === 'l2beat')
    .map((project) => project.id)
  const externalIds = projects
    .filter((project) => project.defiInfo.tvl?.source === 'defillama')
    .map((project) => project.id)
  const externalChainCountByProject = new Map<string, number>(
    projects.flatMap((project) => {
      const tvl = project.defiInfo.tvl
      return tvl?.source === 'defillama'
        ? [[project.id, tvl.chains.length] as const]
        : []
    }),
  )
  const trackedIds = [...l2beatIds, ...externalIds]

  if (trackedIds.length === 0) {
    return new Map()
  }

  if (env.MOCK) {
    return new Map(
      trackedIds.map((projectId) => [
        projectId,
        Math.random() * 1_000_000_000 + 1,
      ]),
    )
  }

  const [l2beatValues, externalValues] = await Promise.all([
    getDb().tvsTokenValue.getSummedByProjectForRanges(
      l2beatIds,
      [optionToRange('3d')],
      {
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: false,
      },
    ),
    getDb().defiTvl.getLatestByProjects(externalIds),
  ])

  const tvlByProject = new Map<string, number>()
  for (const row of l2beatValues) {
    tvlByProject.set(row.project, row.value)
  }
  const freshnessCutoff = UnixTime.now() - 3 * UnixTime.DAY
  for (const row of externalValues) {
    if (
      row.timestamp >= freshnessCutoff &&
      row.chainCount === externalChainCountByProject.get(row.projectId)
    ) {
      tvlByProject.set(row.projectId, row.valueUsd)
    }
  }
  return tvlByProject
}

function compareDefiSummaryEntries(
  a: DefiSummaryEntry,
  b: DefiSummaryEntry,
): number {
  if (a.totalValueLockedUsd === undefined) {
    return b.totalValueLockedUsd === undefined
      ? a.name.localeCompare(b.name)
      : 1
  }
  if (b.totalValueLockedUsd === undefined) {
    return -1
  }
  const difference = b.totalValueLockedUsd - a.totalValueLockedUsd
  if (difference !== 0) {
    return difference
  }
  return a.name.localeCompare(b.name)
}
