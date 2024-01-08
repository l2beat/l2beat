import { ProjectRiskViewEntry } from './ProjectRisk'

export interface ProjectRiskView
  extends Required<{
    validatedBy?: ProjectRiskViewEntry
    sourceUpgradeability?: ProjectRiskViewEntry
    destinationToken?: ProjectRiskViewEntry
  }> {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  exitWindow: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  proposerFailure: ProjectRiskViewEntry
}
