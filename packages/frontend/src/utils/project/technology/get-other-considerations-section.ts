import type { Project } from '@l2beat/config'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getOtherConsiderationsSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const items =
    project.scalingTechnology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  return getTechnologySectionProps(project, items)
}
