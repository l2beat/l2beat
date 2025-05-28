import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'
import { isProjectOther } from '../../utils/is-project-other'

export interface TvsProject {
  projectId: ProjectId
  category?: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export async function getTvsProjects(
  filter: (p: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean,
  previewRecategorisation?: boolean,
): Promise<TvsProject[]> {
  const projects = await ps.getProjects({
    select: ['statuses', 'tvsConfig'],
    optional: ['chainConfig', 'scalingInfo', 'isBridge'],
  })

  const filteredProjects = projects
    .filter((p) => filter(p))
    .filter((project) => !env.EXCLUDED_TVS_PROJECTS?.includes(project.id))

  return filteredProjects.map((project) => ({
    projectId: project.id,
    category: getCategory(project, previewRecategorisation),
  }))
}

function getCategory(
  p: Project<never, 'scalingInfo'>,
  previewRecategorisation?: boolean,
): 'rollups' | 'validiumsAndOptimiums' | 'others' | undefined {
  if (!p.scalingInfo) {
    return undefined
  }

  if (isProjectOther(p.scalingInfo, previewRecategorisation)) {
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
