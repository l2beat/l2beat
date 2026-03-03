import type { Project } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'

export interface ZkCatalogProjectForTvs {
  projectId: ProjectId
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export function getZkCatalogProjectsForTvs(
  projectsForTvs: ZkCatalogProjectForTvs[] | undefined,
  allProjects: Project<never, 'daBridge' | 'isScaling' | 'isDaLayer'>[],
): ZkCatalogProjectForTvs[] {
  if (!projectsForTvs) {
    return []
  }

  const logger = getLogger()
  const allProjectsMap = new Map(
    allProjects.map((project) => [project.id, project]),
  )

  const expanded = projectsForTvs.flatMap((tvsProject) => {
    const project = allProjectsMap.get(tvsProject.projectId)
    if (!project) {
      logger.warn(`Project ${tvsProject.projectId} not found`)
      return []
    }

    if (!project.daBridge) {
      return [tvsProject]
    }

    return project.daBridge.usedIn.flatMap((usedInProject) => {
      const usedProject = allProjectsMap.get(usedInProject.id)
      if (!usedProject) {
        logger.warn(`Project ${usedInProject.id} not found`)
        return []
      }

      return {
        projectId: usedInProject.id,
        sinceTimestamp: tvsProject.sinceTimestamp,
        untilTimestamp: tvsProject.untilTimestamp,
      }
    })
  })

  const deduplicated = new Map<string, ZkCatalogProjectForTvs>()
  for (const entry of expanded) {
    const key = `${entry.projectId}-${entry.sinceTimestamp}-${entry.untilTimestamp ?? 'none'}`
    deduplicated.set(key, entry)
  }

  return [...deduplicated.values()]
}
