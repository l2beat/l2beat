import type { ProjectCrops } from '@l2beat/config'
import type { ResolvedCrops } from '@l2beat/config/build/crops/canonicalCrops'
import {
  qualifiesForGarden,
  resolveProjectCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { env } from '~/env'

export interface ProjectGardenCrops {
  crops: ResolvedCrops
  inGarden: boolean
}

export function getProjectGardenCrops(
  crops: ProjectCrops | undefined,
): ProjectGardenCrops | undefined {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED || !crops) {
    return undefined
  }
  const resolved = resolveProjectCrops(crops)
  return { crops: resolved, inGarden: qualifiesForGarden(resolved) }
}
