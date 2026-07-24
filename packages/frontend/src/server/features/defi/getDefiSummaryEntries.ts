import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { manifest } from '~/utils/Manifest'

export type DefiProject = Project<
  'display' | 'defiInfo' | 'statuses',
  | 'contracts'
  | 'permissions'
  | 'discoveryInfo'
  | 'externalDependencies'
  | 'tvsConfig'
>

export interface DefiSummaryDependency {
  name: string
  slug: string
  icon: string
  url?: string
}

export interface DefiSummaryEntry {
  id: string
  slug: string
  name: string
  shortName: string | undefined
  icon: string
  href: string
  description: string
  category: string
  totalValueLockedUsd: number | undefined
  dependencies: DefiSummaryDependency[]
  isUnderReview: boolean
}

export async function getDefiSummaryEntries(
  projects: DefiProject[],
): Promise<DefiSummaryEntry[]> {
  const totalValueLockedByProject = await getTotalValueLockedByProject(projects)

  return projects
    .map(
      (project): DefiSummaryEntry => ({
        id: project.id,
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: `/defi/projects/${project.slug}`,
        description: project.display.description,
        category: project.defiInfo.category,
        totalValueLockedUsd: totalValueLockedByProject.get(project.id),
        dependencies: (project.externalDependencies ?? []).flatMap(
          (dependency): DefiSummaryDependency[] => {
            if (dependency.project) {
              const dependencyProject = projects.find(
                (candidate) => candidate.id === dependency.project,
              )
              if (!dependencyProject) return []

              return [
                {
                  name: dependencyProject.name,
                  slug: dependencyProject.slug,
                  icon: manifest.getUrl(`/icons/${dependencyProject.slug}.png`),
                  url: `/defi/projects/${dependencyProject.slug}`,
                },
              ]
            }

            if (!dependency.name || !dependency.icon) return []

            return [
              {
                name: dependency.name,
                slug: dependency.icon,
                icon: manifest.getUrl(`/icons/${dependency.icon}.png`),
              },
            ]
          },
        ),
        isUnderReview: !!project.statuses.reviewStatus,
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
}

async function getTotalValueLockedByProject(projects: DefiProject[]) {
  const trackedProjects = projects.filter(
    (project) => project.tvsConfig !== undefined,
  )
  const totals = new Map<string, number>(
    trackedProjects.map((project): [string, number] => [project.id, 0]),
  )

  if (env.MOCK) {
    for (const project of trackedProjects) {
      totals.set(project.id, Math.random() * 1_000_000_000)
    }
    return totals
  }

  const tokenValues = await getDb().tvsTokenValue.getLastNonZeroValueByProjects(
    UnixTime.now(),
    trackedProjects.map((project) => project.id),
  )

  for (const tokenValue of tokenValues) {
    totals.set(
      tokenValue.projectId,
      (totals.get(tokenValue.projectId) ?? 0) + tokenValue.valueForProject,
    )
  }

  return totals
}
