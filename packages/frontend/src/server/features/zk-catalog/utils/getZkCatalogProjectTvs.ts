import type { Project } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import { getLogger } from '~/server/utils/logger'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { getTvsTargetTimestamp } from '../../scaling/tvs/utils/getTvsTargetTimestamp'

export function getZkCatalogProjectTvs(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
) {
  const target = getTvsTargetTimestamp()
  const todayTvsProjects = getLiveProjectsAtTimestamp(
    project.zkCatalogInfo.projectsForTvs,
    target,
  )
  const sevenDaysAgoTvsProjects = getLiveProjectsAtTimestamp(
    project.zkCatalogInfo.projectsForTvs,
    target - 7 * UnixTime.DAY,
  )

  const projectsForTodayTvs = getProjectsForTvs(todayTvsProjects, allProjects)
  const projectsForSevenDaysAgoTvs = getProjectsForTvs(
    sevenDaysAgoTvsProjects,
    allProjects,
  )

  const projectTvs = projectsForTodayTvs.reduce((acc, projectId) => {
    return acc + (tvs.projects[projectId]?.breakdown.total ?? 0)
  }, 0)
  const tvs7d = projectsForSevenDaysAgoTvs.reduce((acc, p) => {
    return acc + (tvs.projects[p]?.breakdown7d.total ?? 0)
  }, 0)

  return {
    tvs: projectTvs,
    change: calculatePercentageChange(projectTvs, tvs7d),
  }
}

function getLiveProjectsAtTimestamp(
  projects:
    | {
        projectId: ProjectId
        sinceTimestamp: UnixTime
        untilTimestamp?: UnixTime
      }[]
    | undefined,
  timestamp: UnixTime,
): ProjectId[] {
  if (!projects) return []
  return projects
    .filter((p) => {
      return (
        p.sinceTimestamp <= timestamp &&
        (p.untilTimestamp === undefined || p.untilTimestamp >= timestamp)
      )
    })
    .map((p) => p.projectId)
}

function getProjectsForTvs(
  projectIds: ProjectId[],
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
) {
  return uniq(
    projectIds.flatMap((tp) => {
      const project = allProjects.find((p) => p.id === tp)
      if (!project) {
        const logger = getLogger().for('getZkCatalogEntry')
        logger.warn(`Project ${tp} not found`)
        return []
      }

      // if project is a DA bridge we want to get summed TVS of all projects secured by this bridge
      if (project.daBridge) {
        return project.daBridge.usedIn.flatMap((p) => p.id)
      }
      return tp
    }),
  )
}
