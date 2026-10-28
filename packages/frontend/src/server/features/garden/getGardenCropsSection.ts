import type { ProjectGarden } from '@l2beat/config'
import {
  measureOssificationBand,
  type OssificationHistory,
} from '@l2beat/shared/frontend'
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
    garden?: ProjectGarden | undefined
    ossificationHistory?: OssificationHistory | undefined
  },
  ossification: OssificationStats | undefined,
): Promise<ProjectDetailsSection | undefined> {
  if (
    !env.CLIENT_SIDE_GARDEN_ENABLED ||
    !project.garden ||
    !(await isCropsAttested(project.id))
  ) {
    return undefined
  }
  const { crops, listing } =
    project.garden.verdicts[
      measureOssificationBand(project.ossificationHistory, UnixTime.now())
    ]
  return {
    type: 'GardenCropsSection',
    props: {
      id: 'crops',
      title: 'CROPS',
      crops,
      listing,
      ossification: describeOssification(ossification),
    },
  }
}
