import { ProjectService } from '@l2beat/config'

/** The reviewed set is what gets attested, not the garden: a project with a red crop is named too. */
export async function getReviewedProjectIds(
  ps = new ProjectService(),
): Promise<string[]> {
  const projects = await ps.getProjects({ where: ['crops'], select: ['crops'] })
  return projects.map((project) => project.id).sort()
}
