import type { BackendProject } from '@l2beat/backend-shared'
import {
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
  toBackendProject,
} from '@l2beat/backend-shared'
import type { Bridge, ChainConfig, Layer2, Layer3 } from '@l2beat/config'
import { bridges, layer2s, layer3s } from '@l2beat/config'
import type { AmountConfigEntry, ProjectId } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { isProjectOther } from '../../utils/is-project-other'

export interface BaseProject {
  projectId: ProjectId
  type: BackendProject['type']
}

export interface TvsProject extends BaseProject {
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

export function toTvsProject(
  project: Layer2 | Layer3 | Bridge,
  chains: ChainConfig[],
): TvsProject {
  const backendProject = toBackendProject(project)
  const amounts = getTvlAmountsConfigForProject(backendProject, chains)

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
const backendProjects = projects.map(toBackendProject)

export function getTvsProjects(
  filter: (p: Layer2 | Layer3 | Bridge) => boolean,
  chains: ChainConfig[],
  previewRecategorisation?: boolean,
): TvsProject[] {
  const filteredProjects = projects
    .filter((p) => filter(p))
    .map(toBackendProject)
    .filter(
      (project) => !env.EXCLUDED_TVS_PROJECTS?.includes(project.projectId),
    )

  const tvsAmounts = getTvlAmountsConfig(backendProjects, chains)
  const tvsAmountsMap: Record<string, AmountConfigEntry[]> = groupBy(
    tvsAmounts,
    (e) => e.project,
  )

  const result = filteredProjects.flatMap(({ projectId, type, slug }) => {
    const amounts = tvsAmountsMap[projectId]
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
      category: getCategory(project, previewRecategorisation),
    }
  })

  return result
}

function getCategory(
  p: Layer2 | Layer3 | Bridge,
  previewRecategorisation?: boolean,
): 'rollups' | 'validiumsAndOptimiums' | 'others' | undefined {
  if (p.type === 'bridge') {
    return undefined
  }

  if (isProjectOther(p, previewRecategorisation)) {
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
