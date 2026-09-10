import type { ProjectCrops, ResolvedCrops } from '@l2beat/config'
import { CROPS } from '@l2beat/config'

const { qualifiesForGarden, resolveProjectCrops } = CROPS.canonicalCrops

export interface ProjectGardenCrops {
  crops: ResolvedCrops
  inGarden: boolean
}

export function getProjectGardenCrops(
  crops: ProjectCrops | undefined,
): ProjectGardenCrops | undefined {
  if (!crops) {
    return undefined
  }
  const resolved = resolveProjectCrops(crops)
  return { crops: resolved, inGarden: qualifiesForGarden(resolved) }
}
