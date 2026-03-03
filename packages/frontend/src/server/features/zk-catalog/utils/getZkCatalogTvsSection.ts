import type { Project } from '@l2beat/config'
import type { ZkCatalogTvsSectionProps } from '~/components/projects/sections/tvs/ZkCatalogTvsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getLogger } from '~/server/utils/logger'
import { optionToRange } from '~/utils/range/range'
import { withProjectIcon } from '~/utils/withProjectIcon'
import { getZkCatalogProjectsForTvs } from './getZkCatalogProjectsForTvs'

export function getZkCatalogTvsSection(
  project: Project<'zkCatalogInfo', 'tvsInfo' | 'milestones'>,
  allProjects: Project<never, 'daBridge' | 'isScaling' | 'isDaLayer'>[],
): Omit<ZkCatalogTvsSectionProps, keyof ProjectSectionProps> | undefined {
  const allProjectsMap = new Map(
    allProjects.map((project) => [project.id, project]),
  )

  const projectsForTvs: ZkCatalogTvsSectionProps['projectsForTvs'] =
    getZkCatalogProjectsForTvs(
      project.zkCatalogInfo.projectsForTvs,
      allProjects,
    ).flatMap((tvsProject) => {
      const tvsProjectConfig = allProjectsMap.get(tvsProject.projectId)
      if (!tvsProjectConfig) {
        const logger = getLogger().for('getZkCatalogTvsSection')
        logger.warn(`Project ${tvsProject.projectId} not found`)
        return []
      }

      return {
        ...tvsProject,
        name: tvsProjectConfig.name,
      }
    })

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
