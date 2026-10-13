import type { Project } from '@l2beat/config'
import { getTechnologyChoicesSectionProps } from './getTechnologyChoicesSectionProps'
import { makeTechnologyChoice } from './makeTechnologySection'

export function getOtherConsiderationsSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const items =
    project.scalingTechnology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  return getTechnologyChoicesSectionProps(project, items)
}
