import {
  type BackendProject,
  type Bridge,
  type Layer2,
  type Layer3,
  bridgeToBackendProject,
  bridges,
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
  layer2ToBackendProject,
  layer2s,
  layer3ToBackendProject,
  layer3s,
  toBackendProject,
} from '@l2beat/config'
import {
  type AmountConfigEntry,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { env } from '~/env'

export interface BaseProject {
  projectId: ProjectId
  type: BackendProject['type']
}

export interface TvlProject extends BaseProject {
  minTimestamp: UnixTime
  slug: string
  sources: Map<
    string,
    {
      name: string
      minTimestamp: UnixTime
    }
  >
}

export function toTvlProject(project: Layer2 | Layer3 | Bridge): TvlProject {
  const backendProject = toBackendProject(project)
  const amounts = getTvlAmountsConfigForProject(backendProject)

  const minTimestamp = amounts
    .map((x) => x.sinceTimestamp)
    .reduce((a, b) => UnixTime.min(a, b), UnixTime.now())

  const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
  for (const amount of amounts) {
    const source = sources.get(amount.dataSource)
    if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
      sources.set(amount.dataSource, {
        name: amount.dataSource,
        minTimestamp: amount.sinceTimestamp,
      })
    }
  }

  return {
    projectId: backendProject.projectId,
    minTimestamp,
    type: backendProject.type,
    slug: backendProject.slug,
    sources,
  }
}

const projects = [
  ...layer2s.map(layer2ToBackendProject),
  ...layer3s.map(layer3ToBackendProject),
  ...bridges.map(bridgeToBackendProject),
]

export function getTvlProjects(
  filter: (p: BaseProject) => boolean,
): TvlProject[] {
  const filteredProjects = projects
    .filter((p) => filter(p))
    .filter(
      (project) => !env.EXCLUDED_TVL_PROJECTS?.includes(project.projectId),
    )

  const tvlAmounts = getTvlAmountsConfig(projects)
  const tvlAmountsMap: Record<string, AmountConfigEntry[]> = {}
  for (const amountEntry of tvlAmounts) {
    tvlAmountsMap[amountEntry.project] ??= []
    tvlAmountsMap[amountEntry.project]?.push(amountEntry)
  }

  const result = filteredProjects.flatMap(({ projectId, type, slug }) => {
    const amounts = tvlAmountsMap[projectId]
    if (!amounts) {
      return []
    }
    const minTimestamp = amounts
      .map((x) => x.sinceTimestamp)
      .reduce((a, b) => UnixTime.min(a, b), UnixTime.now())

    const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
    for (const amount of amounts) {
      const source = sources.get(amount.dataSource)
      if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
        sources.set(amount.dataSource, {
          name: amount.dataSource,
          minTimestamp: amount.sinceTimestamp,
        })
      }
    }
    return { projectId, minTimestamp, type, slug, sources }
  })

  return result
}
