import { type Layer2 } from '@l2beat/config'
import { makeTechnologyChoice } from './make-technology-section'
import { getTechnologySectionProps } from './get-technology-section-props'

export function getOtherConsiderationsSection(project: Layer2) {
  const items =
    project.technology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  return getTechnologySectionProps(project, items)
}
