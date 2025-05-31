import type { Project } from '@l2beat/config'
import { getTechnologyChoicesSectionProps } from './get-technology-choices-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getOtherConsiderationsSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const items =
    project.scalingTechnology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  return getTechnologyChoicesSectionProps(project, items)
}

export function getBridgeOtherConsiderationsSection(
  project: Project<'statuses' | 'bridgeTechnology'>,
) {
  const items =
    project.bridgeTechnology.otherConsiderations?.map((x, i) =>
      makeTechnologyChoice(`other-considerations-${i + 1}`, x),
    ) ?? []

  if (items.length === 0 && !project.statuses.reviewStatus) {
    return undefined
  }

  return {
    items,
    isUnderReview:
      items.every((x) => x.isUnderReview) || !!project.statuses.reviewStatus,
  }
}
