import { env } from '~/env'
import { getListedGardenProjects } from './getListedGardenProjects'

/** The ids of the projects the garden lists; none while the garden is off. */
export async function getListedGardenProjectIds(): Promise<Set<string>> {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED) {
    return new Set()
  }
  const { listed } = await getListedGardenProjects()
  return new Set(listed.map(({ project }) => project.id.toString()))
}
