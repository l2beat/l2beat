import { env } from '~/env'
import { getListedGardenProjects } from '~/server/features/garden/getListedGardenProjects'
import type { Manifest } from '~/utils/Manifest'
import type { HomeStackedIcon } from './components/HomeStackedIcons'

/**
 * The projects the garden lists, in its editorial order. Empty while the
 * garden is off, so the banner never links to a page that does not exist.
 */
export async function getHomeCropsProjects(
  manifest: Manifest,
): Promise<HomeStackedIcon[]> {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED) {
    return []
  }

  const { listed } = await getListedGardenProjects()
  return listed.map(({ project }) => ({
    name: project.name,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
  }))
}
