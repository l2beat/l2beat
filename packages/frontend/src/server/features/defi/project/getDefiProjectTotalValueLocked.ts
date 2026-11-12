import { ps } from '~/server/projects'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'

/** The latest value; undefined when the project's value is not tracked. */
export async function getDefiProjectTotalValueLocked(
  slug: string,
): Promise<number | undefined> {
  const project = await ps.getProject({ slug, select: ['defiInfo'] })
  if (!project) return undefined
  const tvlByProject = await getTotalValueLockedByProject([project])
  return tvlByProject.get(project.id)
}
