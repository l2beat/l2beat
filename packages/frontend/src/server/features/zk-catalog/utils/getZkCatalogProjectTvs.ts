import type { Project } from '@l2beat/config'
import uniq from 'lodash/uniq'
import { getLogger } from '~/server/utils/logger'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import type { ContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'

export function getZkCatalogProjectTvs(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
  contractUtils: ContractUtils,
) {
  const usedInVerifiers = uniq(
    project.zkCatalogInfo.verifierHashes
      .flatMap((v) =>
        v.knownDeployments.flatMap((d) =>
          contractUtils.getUsedIn(project.id, d.chain, d.address),
        ),
      )
      .map((u) => u.id),
  )
  const projectsForTvs = uniq(
    usedInVerifiers.flatMap((vp) => {
      const project = allProjects.find((p) => p.id === vp)
      if (!project) {
        const logger = getLogger().for('getZkCatalogEntry')
        logger.warn(`Project ${vp} not found`)
        return []
      }

      // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
      if (project.daBridge) {
        return project.daBridge.usedIn.flatMap((p) => p.id)
      }
      return vp
    }),
  )

  const projectTvs = projectsForTvs.reduce((acc, projectId) => {
    return acc + calculateProjectTvs(projectId, allProjects, tvs)
  }, 0)

  const tvs7d = projectsForTvs.reduce((acc, p) => {
    const projectTvs = tvs.projects[p]?.breakdown7d.total
    if (!projectTvs) {
      return acc
    }
    return acc + projectTvs
  }, 0)

  return {
    tvs: projectTvs,
    change: calculatePercentageChange(projectTvs, tvs7d),
  }
}

export function calculateProjectTvs(
  projectId: string,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
): number {
  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    const logger = getLogger().for('getZkCatalogEntry')
    logger.warn(`Project ${projectId} not found`)
    return 0
  }

  // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
  if (project.daBridge) {
    return project.daBridge.usedIn
      .map((p) => p.id)
      .reduce((acc, p) => {
        const projectTvs = tvs.projects[p]?.breakdown.total
        return projectTvs ? acc + projectTvs : acc
      }, 0)
  }

  return tvs.projects[project.id]?.breakdown.total ?? 0
}
