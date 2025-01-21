import type { ScalingProjectRiskViewEntry } from './ScalingProjectRisk'

export interface ScalingProjectRiskView {
  stateValidation: ScalingProjectRiskViewEntry
  dataAvailability: ScalingProjectRiskViewEntry
  exitWindow: ScalingProjectRiskViewEntry
  sequencerFailure: ScalingProjectRiskViewEntry
  proposerFailure: ScalingProjectRiskViewEntry
}
