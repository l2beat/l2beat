import type { ProjectCrops } from '@l2beat/config'
import { qualifiesForGarden, resolveProjectCrops } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'

/** Goes first on a project page: the CROPS verdict is a reading of the whole protocol. */
export function getGardenCropsSection(
  crops: ProjectCrops | undefined,
): ProjectDetailsSection | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !crops) {
    return undefined
  }
  const resolved = resolveProjectCrops(crops)
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: resolved,
      inGarden: qualifiesForGarden(resolved),
    },
  }
}
