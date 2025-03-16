import { type Project } from '@l2beat/config'
import { compact } from 'lodash'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getScalingTechnologySection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const items = compact([
    project.scalingTechnology.stateCorrectness &&
      makeTechnologyChoice(
        'state-correctness',
        project.scalingTechnology.stateCorrectness,
      ),
    project.scalingTechnology.newCryptography &&
      makeTechnologyChoice(
        'new-cryptography',
        project.scalingTechnology.newCryptography,
      ),
  ])

  return getTechnologySectionProps(project, items)
}

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
      items.every((x) => x.isUnderReview) || project.statuses.isUnderReview,
  }
}
