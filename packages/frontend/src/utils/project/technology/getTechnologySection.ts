import type { Project } from '@l2beat/config'
import compact from 'lodash/compact'
import { makeTechnologyChoice } from './makeTechnologySection'

export function getBridgeTechnologySection(
  project: Project<'statuses' | 'bridgeTechnology'>,
) {
  const items = compact([
    project.bridgeTechnology.principleOfOperation &&
      makeTechnologyChoice(
        'principle-of-operation',
        project.bridgeTechnology.principleOfOperation,
      ),
    project.bridgeTechnology.validation &&
      makeTechnologyChoice('validation', project.bridgeTechnology.validation),
    project.bridgeTechnology.destinationToken &&
      makeTechnologyChoice(
        'destination-token',
        project.bridgeTechnology.destinationToken,
      ),
  ])

  if (items.length === 0) {
    return undefined
  }

  return {
    items,
    isUnderReview:
      items.every((x) => x.isUnderReview) || !!project.statuses.reviewStatus,
  }
}
