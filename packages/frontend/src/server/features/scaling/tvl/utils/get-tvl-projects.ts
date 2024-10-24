import {
  type BackendProject,
  type Bridge,
  type Layer2,
  type Layer3,
  bridgeToBackendProject,
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
  layer2ToBackendProject,
  layer3ToBackendProject,
  toBackendProject,
} from '@l2beat/config'
import {
  resolvedBridges,
  resolvedLayer2s,
  resolvedLayer3s,
} from '@l2beat/config/projects'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'

export interface TvlProject {
  id: ProjectId
  minTimestamp: UnixTime
  type: BackendProject['type']
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
    id: backendProject.projectId,
    minTimestamp,
    type: backendProject.type,
    slug: backendProject.slug,
    sources,
  }
}

export function getTvlProjects(): TvlProject[] {
  const projects = [
    ...resolvedLayer2s.map(layer2ToBackendProject),
    ...resolvedLayer3s.map(layer3ToBackendProject),
    ...resolvedBridges.map(bridgeToBackendProject),
  ]

  const tvlAmounts = getTvlAmountsConfig(projects)

  return projects
    .flatMap(({ projectId, type, slug }) => {
      const amounts = tvlAmounts.filter((o) => o.project === projectId)
      if (!amounts) {
        return []
      }
      const minTimestamp = amounts
        .map((x) => x.sinceTimestamp)
        .reduce((a, b) => UnixTime.min(a, b), UnixTime.now())

      const sources = new Map<
        string,
        { name: string; minTimestamp: UnixTime }
      >()
      for (const amount of amounts) {
        const source = sources.get(amount.dataSource)
        if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
          sources.set(amount.dataSource, {
            name: amount.dataSource,
            minTimestamp: amount.sinceTimestamp,
          })
        }
      }
      return { id: projectId, minTimestamp, type, slug, sources }
    })
    .filter((project) => !env.EXCLUDED_TVL_PROJECTS?.includes(project.id))
}
