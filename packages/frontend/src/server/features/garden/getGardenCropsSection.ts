import type { ProjectGardenInfo } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'

/** Goes first on a project page: the CROPS verdict is a reading of the whole protocol. */
export function getGardenCropsSection(
  gardenInfo: ProjectGardenInfo | undefined,
): ProjectDetailsSection | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !gardenInfo) {
    return undefined
  }
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: gardenInfo.crops,
      inGarden: gardenInfo.inGarden,
    },
  }
}
