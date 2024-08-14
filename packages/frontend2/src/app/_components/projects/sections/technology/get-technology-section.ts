import { type Layer2 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { makeTechnologyChoice } from './make-technology-section'
import { getTechnologySectionProps } from './get-technology-section-props'

export function getTechnologySection(project: Layer2) {
  const items = [
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
  ].filter(notUndefined)

  return getTechnologySectionProps(project, items)
}
