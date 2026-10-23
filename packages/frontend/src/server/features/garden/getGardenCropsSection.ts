import type { ProjectCrops } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import { isCropsAttested } from './getAttestationsMeta'
import { qualifiesForGarden, resolveProjectCrops } from './resolveCrops'

/**
 * Goes first on a project page: the CROPS verdict is a reading of the whole
 * protocol. Shown only once the current attestation names the project.
 */
export async function getGardenCropsSection(
  projectId: string,
  crops: ProjectCrops | undefined,
): Promise<ProjectDetailsSection | undefined> {
  if (
    !env.CLIENT_SIDE_GARDEN_ENABLED ||
    !crops ||
    !(await isCropsAttested(projectId))
  ) {
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
