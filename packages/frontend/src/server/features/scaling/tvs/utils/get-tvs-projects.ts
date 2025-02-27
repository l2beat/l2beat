import {
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
} from '@l2beat/backend-shared'
import type {
  Bridge,
  ChainConfig,
  Layer2,
  Layer3,
  Project,
} from '@l2beat/config'
import type { AmountConfigEntry, ProjectId } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { isProjectOther } from '../../utils/is-project-other'

export interface TvsProject {
  projectId: ProjectId
  minTimestamp: UnixTime
  sources: Map<
    string,
    {
      name: string
      minTimestamp: UnixTime
    }
  >
  category?: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export async function toTvsProject(
  project: Layer2 | Layer3 | Bridge,
  chains: ChainConfig[],
): Promise<TvsProject> {
  const backendProject = await ps.getProject({
    id: project.id,
    select: ['tvlConfig'],
    optional: ['chainConfig'],
  })
  assert(backendProject !== undefined)
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
    projectId: backendProject.id,
    minTimestamp,
    sources,
  }
}

let backendProjects: Project<'tvlConfig', 'chainConfig'>[] | undefined
async function getBackendProjects() {
  if (!backendProjects) {
    backendProjects = await ps.getProjects({
      select: ['tvlConfig'],
      optional: ['chainConfig'],
    })
  }
  return backendProjects
}

export async function getTvsProjects(
  filter: (p: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean,
  chains: ChainConfig[],
  previewRecategorisation?: boolean,
): Promise<TvsProject[]> {
  const projects = await ps.getProjects({
    select: ['statuses'],
    where: ['tvlInfo'],
    optional: ['scalingInfo', 'isBridge'],
  })

  const filteredProjects = projects
    .filter((p) => filter(p))
    .filter((project) => !env.EXCLUDED_TVS_PROJECTS?.includes(project.id))

  const backendProjects = await getBackendProjects()
  const tvsAmounts = getTvlAmountsConfig(backendProjects, chains)
  const tvsAmountsMap: Record<string, AmountConfigEntry[]> = groupBy(
    tvsAmounts,
    (e) => e.project,
  )

  return filteredProjects.flatMap(({ id }) => {
    const amounts = tvsAmountsMap[id]
    if (!amounts) {
      return []
    }
    const project = projects.find((p) => p.id === id)
    assert(project, `Project not found: ${id}`)

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
      projectId: id,
      minTimestamp,
      sources,
      category: getCategory(project, previewRecategorisation),
    }
  })
}

function getCategory(
  p: Project<never, 'scalingInfo'>,
  previewRecategorisation?: boolean,
): 'rollups' | 'validiumsAndOptimiums' | 'others' | undefined {
  if (!p.scalingInfo) {
    return undefined
  }

  if (isProjectOther(p.scalingInfo, previewRecategorisation)) {
    return 'others'
  }

  if (
    p.scalingInfo.type === 'Optimistic Rollup' ||
    p.scalingInfo.type === 'ZK Rollup'
  ) {
    return 'rollups'
  }

  if (
    p.scalingInfo.type === 'Validium' ||
    p.scalingInfo.type === 'Optimium' ||
    p.scalingInfo.type === 'Plasma'
  ) {
    return 'validiumsAndOptimiums'
  }
}
