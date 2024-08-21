import { type Layer2, type Layer3 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getTechnologySection(project: Layer2 | Layer3) {
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
