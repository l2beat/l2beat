import {
  getTvlAmountsConfig,
  getTvlAmountsConfigForProject,
} from '@l2beat/backend-shared'
import type { ChainConfig, Project } from '@l2beat/config'
import type { AmountConfigEntry, ProjectId, Token } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
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
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: ChainConfig[],
  tokenList: Token[],
): Promise<TvsProject> {
  const amounts = getTvlAmountsConfigForProject(project, chains, tokenList)

  const minTimestamp = amounts
    .map((x) => x.sinceTimestamp)
    .reduce((a, b) => Math.min(a, b), UnixTime.now())

  const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
  for (const amount of amounts) {
    const source = sources.get(amount.dataSource)
    if (!source || source.minTimestamp > amount.sinceTimestamp) {
      sources.set(amount.dataSource, {
        name: amount.dataSource,
        minTimestamp: amount.sinceTimestamp,
      })
    }
  }

  return {
    projectId: project.id,
    minTimestamp,
    sources,
  }
}

export async function getTvsProjects(
  filter: (p: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean,
  chains: ChainConfig[],
  tokenList: Token[],
  previewRecategorisation?: boolean,
): Promise<TvsProject[]> {
  const projects = await ps.getProjects({
    select: ['statuses', 'tvlConfig'],
    optional: ['chainConfig', 'scalingInfo', 'isBridge'],
  })

  const filteredProjects = projects
    .filter((p) => filter(p))
    .filter((project) => !env.EXCLUDED_TVS_PROJECTS?.includes(project.id))

  const tvsAmounts = getTvlAmountsConfig(projects, chains, tokenList)
  const tvsAmountsMap: Record<string, AmountConfigEntry[]> = groupBy(
    tvsAmounts,
    (e) => e.project,
  )

  return filteredProjects.flatMap((project) => {
    const amounts = tvsAmountsMap[project.id]
    if (!amounts) {
      return []
    }

    const minTimestamp = amounts
      .map((x) => x.sinceTimestamp)
      .reduce((a, b) => Math.min(a, b), UnixTime.now())

    const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
    for (const amount of amounts) {
      const source = sources.get(amount.dataSource)
      if (!source || source.minTimestamp > amount.sinceTimestamp) {
        sources.set(amount.dataSource, {
          name: amount.dataSource,
          minTimestamp: amount.sinceTimestamp,
        })
      }
    }
    return {
      projectId: project.id,
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
