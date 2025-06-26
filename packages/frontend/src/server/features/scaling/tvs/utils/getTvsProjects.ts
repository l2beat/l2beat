import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'

export interface TvsProject {
  projectId: ProjectId
  category?: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export async function getTvsProjects(
  filter: (p: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean,
  options?: {
    withoutArchivedAndUpcoming?: boolean
  },
): Promise<TvsProject[]> {
  const projects = await ps.getProjects({
    select: ['statuses', 'tvsConfig'],
    optional: ['chainConfig', 'scalingInfo', 'isBridge'],
    whereNot: options?.withoutArchivedAndUpcoming
      ? ['isUpcoming', 'archivedAt']
      : undefined,
  })

  const filteredProjects = projects
    .filter((p) => filter(p))
    .filter((project) => !env.EXCLUDED_TVS_PROJECTS?.includes(project.id))

  return filteredProjects.map((project) => ({
    projectId: project.id,
    category: getCategory(project),
  }))
}

function getCategory(
  p: Project<never, 'scalingInfo'>,
): 'rollups' | 'validiumsAndOptimiums' | 'others' | undefined {
  if (!p.scalingInfo) {
    return undefined
  }

  if (p.scalingInfo.type === 'Other') {
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
