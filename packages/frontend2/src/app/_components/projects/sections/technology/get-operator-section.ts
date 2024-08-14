import { type Layer2 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { makeTechnologyChoice } from './make-technology-section'
import { getTechnologySectionProps } from './get-technology-section-props'

export function getOperatorSection(project: Layer2) {
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
