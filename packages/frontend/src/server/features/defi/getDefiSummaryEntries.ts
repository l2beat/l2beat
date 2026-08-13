import type { Project, ProjectDefiCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type DefiDependency,
  type DefiDependencyProject,
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
  const [tvlByProject, dependencyProjectsById] = await Promise.all([
    getTotalValueLockedByProject(projects),
    getDependencyProjectsById(projects),
  ])
  return buildDefiSummaryEntries(projects, tvlByProject, dependencyProjectsById)
}

export function buildDefiSummaryEntries(
  projects: DefiProject[],
  tvlByProject: ReadonlyMap<string, number>,
  dependencyProjectsById: ReadonlyMap<string, DefiDependencyProject> = new Map(
    projects.map((project) => [
      project.id,
      { name: project.name, slug: project.slug, isDefi: true },
    ]),
  ),
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
        dependencies: resolveDefiDependencies(
          project.externalDependencies ?? [],
          dependencyProjectsById,
        ),
        isUnderReview: !!project.statuses.reviewStatus,
      }
    })
    .sort(compareDefiSummaryEntries)
}

async function getDependencyProjectsById(
  projects: DefiProject[],
): Promise<Map<string, DefiDependencyProject>> {
  const dependencyProjectsById = new Map(
    projects.map((project) => [
      project.id,
      { name: project.name, slug: project.slug, isDefi: true },
    ]),
  )

  const missingIds = [
    ...new Set(
      projects
        .flatMap((project) => project.externalDependencies ?? [])
        .filter((dependency) => dependency.type === 'tracked')
        .map((dependency) => dependency.projectId)
        .filter((projectId) => !dependencyProjectsById.has(projectId)),
    ),
  ]

  if (missingIds.length === 0) {
    return dependencyProjectsById
  }

  const extraProjects = await ps.getProjects({
    ids: missingIds,
    optional: ['defiInfo'],
  })

  for (const project of extraProjects) {
    dependencyProjectsById.set(project.id, {
      name: project.name,
      slug: project.slug,
      isDefi: project.defiInfo !== undefined,
    })
  }

  return dependencyProjectsById
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
  const difference = b.totalValueLockedUsd - a.totalValueLockedUsd
  if (difference !== 0) {
    return difference
  }
  return a.name.localeCompare(b.name)
}
