import { type ProjectCrops, resolveGarden } from '@l2beat/config'
import type { OssificationHistory } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { describeOssification } from './describeOssification'
import { isCropsAttested } from './getAttestationsMeta'

/**
 * Goes first on a project page: the CROPS verdict is a reading of the whole
 * protocol. Shown only once the current attestation names the project.
 */
export async function getGardenCropsSection(
  project: {
    id: string
    crops?: ProjectCrops | undefined
    ossificationHistory?: OssificationHistory | undefined
  },
  ossification: OssificationStats | undefined,
): Promise<ProjectDetailsSection | undefined> {
  const { crops } = project
  if (
    !env.CLIENT_SIDE_GARDEN_ENABLED ||
    !crops ||
    !(await isCropsAttested(project.id))
  ) {
    return undefined
  }
  const garden = resolveGarden({ ...project, crops }, UnixTime.now())
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops: garden.crops,
      listing: garden.listing,
      ossification: describeOssification(ossification),
    },
  }
}
