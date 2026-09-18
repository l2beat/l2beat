import type { ProjectCropSentiment, ProjectCrops } from '../types'

/**
 * Anything shaped like a set of crops with a sentiment: config's own
 * `ProjectCrops`, whose sentiment is optional, and the resolved shape the site
 * and the API render, where an ungraded crop has become `neutral`. Both answer
 * this question the same way, and it is asked of both.
 */
export type GardenCrops = Record<
  keyof ProjectCrops,
  { sentiment?: ProjectCropSentiment | 'neutral' }
>

/**
 * Whether a project appears in the garden. A single red crop keeps it out,
 * whatever the other three say. It is still reviewed, and its project page
 * still shows the evaluation.
 *
 * The one definition: the site, the API and `l2b crops-attest` all call this,
 * so what is attested onchain cannot drift from what the garden shows.
 */
export function qualifiesForGarden(crops: GardenCrops): boolean {
  return Object.values(crops).every((crop) => crop.sentiment !== 'bad')
}
