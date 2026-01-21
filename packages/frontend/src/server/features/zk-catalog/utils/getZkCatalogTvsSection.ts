import type { Project } from '@l2beat/config'
import { getChartProject } from '~/components/core/chart/utils/getChartProject'
import type { ZkCatalogTvsSectionProps } from '~/components/projects/sections/tvs/ZkCatalogTvsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getLogger } from '~/server/utils/logger'
import { optionToRange } from '~/utils/range/range'

export function getZkCatalogTvsSection(
  project: Project<'zkCatalogInfo', 'tvsInfo' | 'milestones'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): Omit<ZkCatalogTvsSectionProps, keyof ProjectSectionProps> | undefined {
  const projectsForTvs: ZkCatalogTvsSectionProps['projectsForTvs'] =
    project.zkCatalogInfo.projectsForTvs
      ?.flatMap((tvsProject) => {
        const project = allProjects.find((p) => p.id === tvsProject.projectId)
        if (!project) {
          const logger = getLogger().for('getZkCatalogTvsSection')
          logger.warn(`Project ${tvsProject.projectId} not found`)
          return undefined
        }

        if (project.daBridge) {
          return project.daBridge.usedIn.flatMap((p) => ({
            projectId: p.id,
            sinceTimestamp: tvsProject.sinceTimestamp,
            untilTimestamp: tvsProject.untilTimestamp,
          }))
        }
        return tvsProject
      })
      .filter((p) => p !== undefined) ?? []

  if (projectsForTvs.length === 0) {
    return undefined
  }

  return {
    defaultRange: optionToRange('1y'),
    milestones: project.milestones ?? [],
    tvsInfo: project.tvsInfo,
    project: getChartProject(project),
    projectsForTvs,
  }
}
