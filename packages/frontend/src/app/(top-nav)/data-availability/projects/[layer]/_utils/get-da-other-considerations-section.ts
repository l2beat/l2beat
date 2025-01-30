import type { DaBridge, DaLayer } from '@l2beat/config'
import type { TechnologySectionProps } from '~/components/projects/sections/technology-section'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { makeTechnologyChoice } from '~/utils/project/technology/make-technology-section'

export function getDaOtherConsiderationsSection(
  layer: DaLayer,
  bridge: DaBridge,
): Omit<
  TechnologySectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
> {
  const layerConsiderations = layer.otherConsiderations ?? []
  const bridgeConsiderations = bridge.otherConsiderations ?? []
  const items = layerConsiderations
    .concat(bridgeConsiderations)
    .map((x, i) => makeTechnologyChoice(`other-considerations-${i + 1}`, x))

  return {
    items,
  }
}
