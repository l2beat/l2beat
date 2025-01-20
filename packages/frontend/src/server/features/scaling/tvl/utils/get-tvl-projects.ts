import {
  type BackendProject,
  bridgeToBackendProject,
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
  layer2ToBackendProject,
  layer3ToBackendProject,
  toBackendProject,
} from '@l2beat/backend-shared'
import {
  type Bridge,
  type Layer2,
  type Layer3,
  bridges,
  layer2s,
  layer3s,
} from '@l2beat/config'
import {
  assert,
  type AmountConfigEntry,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { isProjectOther } from '../../utils/is-project-other'

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
  category?: 'rollups' | 'validiumsAndOptimiums' | 'others'
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
  filter: (p: Layer2 | Layer3 | Bridge) => boolean,
): TvlProject[] {
  const filteredProjects = projects
    .filter((p) => filter(p))
    .map(toBackendProject)
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
): 'rollups' | 'validiumsAndOptimiums' | 'others' | undefined {
  if (p.type === 'bridge') {
    return undefined
  }

  if (isProjectOther(p)) {
    return 'others'
  }

  if (
    p.display.category === 'Optimistic Rollup' ||
    p.display.category === 'ZK Rollup'
  ) {
    return 'rollups'
  }

  if (
    p.display.category === 'Validium' ||
    p.display.category === 'Optimium' ||
    p.display.category === 'Plasma'
  ) {
    return 'validiumsAndOptimiums'
  }
}
