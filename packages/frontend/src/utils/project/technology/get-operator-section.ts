import type { Layer2, Layer3 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getOperatorSection(project: Layer2 | Layer3) {
  const items = [
    project.technology.operator &&
      makeTechnologyChoice('operator', project.technology.operator),
    project.technology.forceTransactions &&
      makeTechnologyChoice(
        'force-transactions',
        project.technology.forceTransactions,
      ),
  ].filter(notUndefined)

  return getTechnologySectionProps(project, items)
}
