import { type Layer2 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { makeTechnologyChoice } from './make-technology-section'
import { getTechnologySectionProps } from './get-technology-section-props'

export function getWithdrawalsSection(project: Layer2) {
  const items = [
    ...(project.technology.exitMechanisms ?? []).map((x, i) =>
      makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
    ),
    project.technology.massExit &&
      makeTechnologyChoice('mass-exit', project.technology.massExit),
  ].filter(notUndefined)

  return getTechnologySectionProps(project, items)
}
