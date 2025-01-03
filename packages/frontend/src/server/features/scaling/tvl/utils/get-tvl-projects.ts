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
  assert,
  type AmountConfigEntry,
  type ProjectId,
  UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
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
  category?: 'Rollups' | 'ValidiumOrOptimiums' | 'Others'
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

const projects = [...layer2s, ...layer3s, ...bridges]
const backendProjects = [
  ...layer2s.map(layer2ToBackendProject),
  ...layer3s.map(layer3ToBackendProject),
  ...bridges.map(bridgeToBackendProject),
]

export function getTvlProjects(
  filter: (p: BaseProject) => boolean,
): TvlProject[] {
  const filteredProjects = backendProjects
    .filter((p) => filter(p))
    .filter(
      (project) => !env.EXCLUDED_TVL_PROJECTS?.includes(project.projectId),
    )

  const tvlAmounts = getTvlAmountsConfig(backendProjects)
  const tvlAmountsMap: Record<string, AmountConfigEntry[]> = groupBy(
    tvlAmounts,
    (e) => e.project,
  )

  const result = filteredProjects.flatMap(({ projectId, type, slug }) => {
    const amounts = tvlAmountsMap[projectId]
    if (!amounts) {
      return []
    }
    const project = projects.find((p) => p.id === projectId)
    assert(project, `Project not found: ${projectId}`)

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
      projectId,
      minTimestamp,
      type,
      slug,
      sources,
      category: getCategory(project),
    }
  })

  return result
}

function getCategory(
  p: Layer2 | Layer3 | Bridge,
): 'Rollups' | 'ValidiumOrOptimiums' | 'Others' | undefined {
  if (p.type === 'bridge') {
    return undefined
  }

  switch (p.display.category) {
    case 'Validium':
    case 'Optimium':
      return 'ValidiumOrOptimiums'
    case 'Optimistic Rollup':
    case 'ZK Rollup':
      return 'Rollups'
    case 'Other':
      return 'Others'
    case 'Plasma':
      return undefined
    default:
      assertUnreachable(p.display.category)
  }
}
