import type { Project } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { getLogger } from '~/server/utils/logger'
import { getProjectIcon } from '../../utils/getProjectIcon'

export function getProjectsUsedIn(
  usedInVerifiers: ProjectId[],
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): UsedInProjectWithIcon[] {
  return usedInVerifiers
    .map((id) => {
      const project = allProjects.find((p) => p.id === id)
      if (!project) {
        const logger = getLogger().for('getProjectsUsedIn')
        logger.warn(`Project ${id} not found`)
        return undefined
      }

      const href = getProjectHref(project, allProjects)

      return {
        id: id,
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
        href,
      }
    })
    .filter((e) => e !== undefined)
}

function getProjectHref(
  project: Project<never, 'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
) {
  if (project.isBridge) return `/bridges/projects/${project.slug}`
  if (project.isScaling) return `/scaling/projects/${project.slug}`
  if (project.isDaLayer) {
    const daBridge = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daBridge, `DA bridge ${project.id} not found`)

    return `/data-availability/projects/${project.slug}/${daBridge.slug}`
  }
  if (project.daBridge) {
    const daLayer = allProjects.find((p) => p.id === project.daBridge?.daLayer)
    assert(daLayer, `DA layer ${project.daBridge.daLayer} not found`)

    return `/data-availability/projects/${daLayer.slug}/${project.slug}`
  }

  throw new Error(`Unknown project type: ${project.id}`)
}
