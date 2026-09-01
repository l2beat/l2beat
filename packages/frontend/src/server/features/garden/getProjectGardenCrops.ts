import type { ProjectCrops } from '@l2beat/config'
import type { ResolvedCrops } from '@l2beat/config/build/crops/canonicalCrops'
import {
  qualifiesForGarden,
  resolveProjectCrops,
} from '@l2beat/config/build/crops/canonicalCrops'

export interface ProjectGardenCrops {
  crops: ResolvedCrops
  /**
   * Whether the review clears the bar for the garden. False while any crop is
   * red - the project page still shows the whole evaluation, it just says the
   * protocol has not made it in yet.
   */
  inGarden: boolean
}

/**
 * What a project page needs to show its CROPS review: the evaluations with
 * every default resolved, and whether they add up to a place in the garden.
 * Undefined for a project that has not been reviewed, which renders nothing.
 */
export function getProjectGardenCrops(
  crops: ProjectCrops | undefined,
): ProjectGardenCrops | undefined {
  if (!crops) {
    return undefined
  }
  const resolved = resolveProjectCrops(crops)
  return { crops: resolved, inGarden: qualifiesForGarden(resolved) }
}
