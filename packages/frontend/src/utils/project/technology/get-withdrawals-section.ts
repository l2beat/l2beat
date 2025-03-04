import type { Project } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getTechnologySectionProps2 } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getWithdrawalsSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const items = [
    ...(project.scalingTechnology.exitMechanisms ?? []).map((x, i) =>
      makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
    ),
    project.scalingTechnology.massExit &&
      makeTechnologyChoice('mass-exit', project.scalingTechnology.massExit),
  ].filter(notUndefined)

  return getTechnologySectionProps2(project, items)
}
