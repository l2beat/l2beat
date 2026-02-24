import type { Project } from '@l2beat/config'
import type { ZkCatalogTvsSectionProps } from '~/components/projects/sections/tvs/ZkCatalogTvsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getLogger } from '~/server/utils/logger'
import { optionToRange } from '~/utils/range/range'
import { withProjectIcon } from '~/utils/withProjectIcon'

export function getZkCatalogTvsSection(
  project: Project<'zkCatalogInfo', 'tvsInfo' | 'milestones'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): Omit<ZkCatalogTvsSectionProps, keyof ProjectSectionProps> | undefined {
  const allProjectsMap = new Map(
    allProjects.map((project) => [project.id, project]),
  )

  const projectsForTvs: ZkCatalogTvsSectionProps['projectsForTvs'] =
    project.zkCatalogInfo.projectsForTvs
      ?.flatMap((tvsProject) => {
        const project = allProjectsMap.get(tvsProject.projectId)
        if (!project) {
          const logger = getLogger().for('getZkCatalogTvsSection')
          logger.warn(`Project ${tvsProject.projectId} not found`)
          return undefined
        }

        if (project.daBridge) {
          return project.daBridge.usedIn.flatMap((p) => {
            const usedProject = allProjectsMap.get(p.id)
            if (!usedProject) {
              const logger = getLogger().for('getZkCatalogTvsSection')
              logger.warn(`Project ${p.id} not found`)
              return []
            }

            return {
              projectId: p.id,
              name: usedProject.name,
              sinceTimestamp: tvsProject.sinceTimestamp,
              untilTimestamp: tvsProject.untilTimestamp,
            }
          })
        }
        return {
          projectId: tvsProject.projectId,
          name: project.name,
          sinceTimestamp: tvsProject.sinceTimestamp,
          untilTimestamp: tvsProject.untilTimestamp,
        }
      })
      .filter((p) => p !== undefined) ?? []

  if (projectsForTvs.length === 0) {
    return undefined
  }

  return {
    defaultRange: optionToRange('1y'),
    milestones: project.milestones ?? [],
    tvsInfo: project.tvsInfo,
    project: withProjectIcon(project),
    projectsForTvs,
  }
}
