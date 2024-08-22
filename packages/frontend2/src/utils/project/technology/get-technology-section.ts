import { Bridge, type Layer2, type Layer3 } from '@l2beat/config'
import { compact } from 'lodash'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getScalingTechnologySection(project: Layer2 | Layer3) {
  const items = compact([
    project.technology.stateCorrectness &&
      makeTechnologyChoice(
        'state-correctness',
        project.technology.stateCorrectness,
      ),
    project.technology.newCryptography &&
      makeTechnologyChoice(
        'new-cryptography',
        project.technology.newCryptography,
      ),
    project.technology.dataAvailability &&
      makeTechnologyChoice(
        'data-availability',
        project.technology.dataAvailability,
      ),
  ])

  return getTechnologySectionProps(project, items)
}

export function getBridgeTechnologySection(project: Bridge) {
  const items = compact([
    project.technology.principleOfOperation &&
      makeTechnologyChoice(
        'principle-of-operation',
        project.technology.principleOfOperation,
      ),
    project.technology.validation &&
      makeTechnologyChoice('validation', project.technology.validation),
    project.technology.destinationToken &&
      makeTechnologyChoice(
        'destination-token',
        project.technology.destinationToken,
      ),
  ])

  return getTechnologySectionProps(project, items)
}
