import { ProjectService, qualifiesForGarden } from '@l2beat/config'

/**
 * What the garden shows is what gets attested. A reviewed project with a red
 * crop is left out, exactly as `qualifiesForGarden` leaves it off the page -
 * both call the one predicate in config, so the attestation cannot name a
 * project the site does not.
 */
export async function getGardenProjectIds(
  ps = new ProjectService(),
): Promise<string[]> {
  const projects = await ps.getProjects({ where: ['crops'], select: ['crops'] })
  return projects
    .filter((project) => qualifiesForGarden(project.crops))
    .map((project) => project.id)
    .sort()
}
