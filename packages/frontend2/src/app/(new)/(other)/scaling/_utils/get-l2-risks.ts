import { type ScalingProjectRiskView } from '@l2beat/config'
import { type RosetteValue } from '~/app/_components/rosette/types'

export function getL2Risks(riskView: ScalingProjectRiskView): RosetteValue[] {
  return [
    {
      name: 'Sequencer Failure',
      value: riskView.sequencerFailure.value,
      sentiment: riskView.sequencerFailure.sentiment,
      warning: riskView.sequencerFailure.warning,
    },
    {
      name: 'State Validation',
      value: riskView.stateValidation.value,
      sentiment: riskView.stateValidation.sentiment,
      warning: riskView.stateValidation.warning,
    },
    {
      name: 'Data Availability',
      value: riskView.dataAvailability.value,
      sentiment: riskView.dataAvailability.sentiment,
      warning: riskView.dataAvailability.warning,
    },
    {
      name: 'Exit Window',
      value: riskView.exitWindow.value,
      sentiment: riskView.exitWindow.sentiment,
      warning: riskView.exitWindow.warning,
    },
    {
      name: 'Proposer Failure',
      value: riskView.proposerFailure.value,
      sentiment: riskView.proposerFailure.sentiment,
      warning: riskView.proposerFailure.warning,
    },
  ]
}
