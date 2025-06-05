import type { ProjectScalingRiskView } from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'

export function getL2Risks(riskView: ProjectScalingRiskView): RosetteValue[] {
  return [
    {
      name: 'Sequencer Failure',
      value: riskView.sequencerFailure.value,
      sentiment: riskView.sequencerFailure.sentiment,
      warning: riskView.sequencerFailure.warning,
      description: riskView.sequencerFailure.description,
    },
    {
      name: 'State Validation',
      value: riskView.stateValidation.value,
      sentiment: riskView.stateValidation.sentiment,
      warning: riskView.stateValidation.warning,
      description: riskView.stateValidation.description,
    },
    {
      name: 'Data Availability',
      value: riskView.dataAvailability.value,
      sentiment: riskView.dataAvailability.sentiment,
      warning: riskView.dataAvailability.warning,
      description: riskView.dataAvailability.description,
    },
    {
      name: 'Exit Window',
      value: riskView.exitWindow.value,
      sentiment: riskView.exitWindow.sentiment,
      warning: riskView.exitWindow.warning,
      description: riskView.exitWindow.description,
    },
    {
      name: 'Proposer Failure',
      value: riskView.proposerFailure.value,
      sentiment: riskView.proposerFailure.sentiment,
      warning: riskView.proposerFailure.warning,
      description: riskView.proposerFailure.description,
    },
  ]
}
