import type { Project, ProjectScalingRiskView } from '@l2beat/config'
import type { RosetteValueTuple } from '~/components/rosette/individual/IndividualRosetteIcon'

export interface ScalingRosette {
  self: RosetteValueTuple
  host?: RosetteValueTuple
  stacked?: RosetteValueTuple
}

export function getScalingRosette(project: Project<'scalingRisks'>) {
  return {
    self: getScalingRosetteValues(project.scalingRisks.self),
    host: project.scalingRisks.host
      ? getScalingRosetteValues(project.scalingRisks.host)
      : undefined,
    stacked: project.scalingRisks.stacked
      ? getScalingRosetteValues(project.scalingRisks.stacked)
      : undefined,
  }
}

function getScalingRosetteValues(
  risks: ProjectScalingRiskView,
): RosetteValueTuple {
  return [
    { name: 'Sequencer failure', ...risks.sequencerFailure },
    { name: 'State validation', ...risks.stateValidation },
    { name: 'Data availability', ...risks.dataAvailability },
    { name: 'Exit window', ...risks.exitWindow },
    { name: 'Proposer failure', ...risks.proposerFailure },
  ]
}
