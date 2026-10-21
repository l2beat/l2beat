import { env } from '~/env'
import { compareByCuratedOrder } from '~/pages/garden/getGardenData'
import {
  qualifiesForGarden,
  resolveProjectCrops,
} from '~/server/features/garden/resolveCrops'
import { ps } from '~/server/projects'
import type { Manifest } from '~/utils/Manifest'

export interface HomeCropsProject {
  name: string
  iconUrl: string
}

/**
 * The projects growing in the garden, in its editorial order. Empty while the
 * garden is off, so the banner never links to a page that does not exist.
 */
export async function getHomeCropsProjects(
  manifest: Manifest,
): Promise<HomeCropsProject[]> {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED) {
    return []
  }

  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
  })

  return projects
    .filter((project) => qualifiesForGarden(resolveProjectCrops(project.crops)))
    .sort(compareByCuratedOrder)
    .map((project) => ({
      name: project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }))
}
