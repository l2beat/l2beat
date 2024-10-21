import { type ScalingProjectRiskView } from '@l2beat/config'
import { type RosetteValue } from '~/components/rosette/types'

export function getScalingRosetteValues(
  risks: ScalingProjectRiskView,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Sequencer failure',
      value: risks.sequencerFailure.value,
      sentiment: risks.sequencerFailure.sentiment,
      description: risks.sequencerFailure.description,
      warning: risks.sequencerFailure.warning,
    },
    {
      name: 'State validation',
      value: risks.stateValidation.value,
      sentiment: risks.stateValidation.sentiment,
      description: risks.stateValidation.description,
      warning: risks.stateValidation.warning,
    },
    {
      name: 'Data availability',
      value: risks.dataAvailability.value,
      sentiment: risks.dataAvailability.sentiment,
      description: risks.dataAvailability.description,
      warning: risks.dataAvailability.warning,
    },
    {
      name: 'Exit window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
      description: risks.exitWindow.description,
      warning: risks.exitWindow.warning,
    },
    {
      name: 'Proposer failure',
      value: risks.proposerFailure.value,
      sentiment: risks.proposerFailure.sentiment,
      description: risks.proposerFailure.description,
      warning: risks.proposerFailure.warning,
    },
  ]

  return values
}
