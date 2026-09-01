import type { Project, ProjectDefiCategory } from '@l2beat/config'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
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
  const trackedIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((project) => project.id)

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

  const values = await getDb().tvsTokenValue.getSummedByProjectForRanges(
    trackedIds,
    [optionToRange('3d')],
    {
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )

  const tvlByProject = new Map<string, number>()
  for (const row of values) {
    tvlByProject.set(row.project, row.value)
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
