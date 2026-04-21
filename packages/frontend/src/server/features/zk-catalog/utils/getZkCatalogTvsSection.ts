import type { Milestone, Project } from '@l2beat/config'
import type { ZkCatalogTvsSectionProps } from '~/components/projects/sections/tvs/ZkCatalogTvsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getLogger } from '~/server/utils/logger'
import { optionToRange } from '~/utils/range/range'
import { withProjectIcon } from '~/utils/withProjectIcon'
import { getProjectsUsedIn } from './getTrustedSetupsWithVerifiersAndAttesters'

export function getZkCatalogTvsSection(
  project: Project<'zkCatalogInfo', 'tvsInfo' | 'milestones'>,
  allProjects: Project<never, 'daBridge' | 'scalingInfo' | 'daLayer'>[],
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
  const projectsUsedIn = new Map(
    getProjectsUsedIn(
      projectsForTvs.map((project) => project.projectId),
      allProjects,
    ).map((project) => [project.id, project]),
  )

  const milestonesFromProjects: Milestone[] = projectsForTvs.flatMap((p) => {
    const resolved = projectsUsedIn.get(p.projectId)
    if (!resolved) return []

    return [
      {
        date: new Date(p.sinceTimestamp * 1000).toISOString(),
        title: `${p.name} started using ${project.name}`,
        type: 'project',
        project: { id: p.projectId, name: p.name, icon: resolved.icon },
        linkLabel: 'Go to project page',
        url: resolved.url,
      },
    ]
  })

  const milestones = [...(project.milestones ?? []), ...milestonesFromProjects]

  return {
    defaultRange: optionToRange('1y'),
    milestones: milestones,
    tvsInfo: project.tvsInfo,
    project: withProjectIcon(project),
    projectsForTvs,
  }
}
