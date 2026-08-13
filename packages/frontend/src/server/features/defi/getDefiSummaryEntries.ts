import type { Project, ProjectDefiCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'
import {
  type DefiDependency,
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
  dependencies: DefiDependency[]
  isUnderReview: boolean
}

export async function getDefiSummaryEntries(
  projects: DefiProject[],
): Promise<DefiSummaryEntry[]> {
  const tvlByProject = await getTotalValueLockedByProject(projects)
  return buildDefiSummaryEntries(projects, tvlByProject)
}

export function buildDefiSummaryEntries(
  projects: DefiProject[],
  tvlByProject: ReadonlyMap<string, number>,
): DefiSummaryEntry[] {
  const defiProjectsById = new Map(
    projects.map((project) => [project.id, project]),
  )

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
        dependencies: resolveDefiDependencies(
          project.externalDependencies ?? [],
          defiProjectsById,
        ),
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

  const tokenValues = await getDb().tvsTokenValue.getLastNonZeroValueByProjects(
    UnixTime.now(),
    trackedIds,
  )

  const tvlByProject = new Map<string, number>()
  for (const tokenValue of tokenValues) {
    tvlByProject.set(
      tokenValue.projectId,
      (tvlByProject.get(tokenValue.projectId) ?? 0) +
        tokenValue.valueForProject,
    )
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
  return b.totalValueLockedUsd - a.totalValueLockedUsd
}
