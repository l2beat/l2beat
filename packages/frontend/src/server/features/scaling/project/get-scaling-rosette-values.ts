import type { ScalingProjectRiskView } from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'

export function getScalingRosetteValues(
  risks: ScalingProjectRiskView,
): RosetteValue[] {
  return [
    { name: 'Sequencer failure', ...risks.sequencerFailure },
    { name: 'State validation', ...risks.stateValidation },
    { name: 'Data availability', ...risks.dataAvailability },
    { name: 'Exit window', ...risks.exitWindow },
    { name: 'Proposer failure', ...risks.proposerFailure },
  ]
}
