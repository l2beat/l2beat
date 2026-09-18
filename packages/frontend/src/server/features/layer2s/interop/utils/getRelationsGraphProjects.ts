import type { Project } from '@l2beat/config'
import { ps } from '~/server/projects'

export interface RelationsGraphProjects {
  projectsWithChains: Project<'chainConfig'>[]
  interopProjects: Project<'interopConfig'>[]
}

export async function getRelationsGraphProjects(): Promise<RelationsGraphProjects> {
  const [projectsWithChains, interopProjects] = await Promise.all([
    ps.getProjects({ select: ['chainConfig'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  return { projectsWithChains, interopProjects }
}
