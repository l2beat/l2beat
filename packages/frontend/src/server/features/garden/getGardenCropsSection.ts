import type { ProjectCrops } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { toCropOssification } from './getCropOssification'
import {
  type CropsOssificationScore,
  getGardenListing,
  resolveProjectCrops,
} from './resolveCrops'

/** Goes first on a project page: the CROPS verdict is a reading of the whole protocol. */
export function getGardenCropsSection(
  crops: ProjectCrops | undefined,
  /** From config, so it holds even while the ossification feature is off. */
  ossificationScore: CropsOssificationScore | undefined,
  ossification: OssificationStats | undefined,
): ProjectDetailsSection | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !crops) {
    return undefined
  }
  const resolved = resolveProjectCrops(crops, ossificationScore)
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: resolved,
      listing: getGardenListing(resolved, ossificationScore !== undefined),
      ossification: ossification && toCropOssification(ossification),
    },
  }
}
