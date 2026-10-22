import { type ProjectCrops, resolveProjectCrops } from '@l2beat/config'
import type { OssificationHistory } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { withOssification } from './withOssification'

/** Goes first on a project page: the CROPS verdict is a reading of the whole protocol. */
export function getGardenCropsSection(
  project: {
    crops?: ProjectCrops | undefined
    ossificationHistory?: OssificationHistory | undefined
  },
  ossification: OssificationStats | undefined,
): ProjectDetailsSection | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !project.crops) {
    return undefined
  }
  const { crops, listing } = resolveProjectCrops(
    { crops: project.crops, ossificationHistory: project.ossificationHistory },
    UnixTime.now(),
  )
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: withOssification(crops, ossification),
      listing,
    },
  }
}
