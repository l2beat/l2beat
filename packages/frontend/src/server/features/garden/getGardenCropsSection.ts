import type { ProjectGarden } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { withOssification } from './withOssification'

/** Goes first on a project page: the CROPS verdict is a reading of the whole protocol. */
export function getGardenCropsSection(
  garden: ProjectGarden | undefined,
  ossification: OssificationStats | undefined,
): ProjectDetailsSection | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !garden) {
    return undefined
  }
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: withOssification(garden.crops, ossification),
      listing: garden.listing,
    },
  }
}
