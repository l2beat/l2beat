import type { Layer2, Layer3 } from '@l2beat/config'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getOtherConsiderationsSection(project: Layer2 | Layer3) {
  const items =
    project.technology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  return getTechnologySectionProps(project, items)
}
