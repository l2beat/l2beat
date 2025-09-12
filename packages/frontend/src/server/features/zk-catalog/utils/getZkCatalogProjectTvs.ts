import type { Project } from '@l2beat/config'
import uniq from 'lodash/uniq'
import { getLogger } from '~/server/utils/logger'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'

export function getZkCatalogProjectTvs(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
) {
  const usedInVerifiers = uniq(
    project.zkCatalogInfo.verifierHashes.flatMap((v) => v.usedBy),
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

  const projectTvs = projectsForTvs.reduce((acc, p) => {
    const projectTvs = tvs.projects[p]?.breakdown.total
    if (!projectTvs) {
      return acc
    }
    return acc + projectTvs
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
