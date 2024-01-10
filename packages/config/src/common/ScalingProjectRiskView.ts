import { ScalingProjectRiskViewEntry } from './ScalingProjectRisk'

export interface ScalingProjectRiskView
  extends Required<{
    validatedBy?: ScalingProjectRiskViewEntry
    sourceUpgradeability?: ScalingProjectRiskViewEntry
    destinationToken?: ScalingProjectRiskViewEntry
  }> {
  stateValidation: ScalingProjectRiskViewEntry
  dataAvailability: ScalingProjectRiskViewEntry
  exitWindow: ScalingProjectRiskViewEntry
  sequencerFailure: ScalingProjectRiskViewEntry
  proposerFailure: ScalingProjectRiskViewEntry
}
