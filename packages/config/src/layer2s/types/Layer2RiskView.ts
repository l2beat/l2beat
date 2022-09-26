import { ProjectRiskViewEntry } from '../../common'

export interface Layer2RiskView {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  validatorFailure: ProjectRiskViewEntry
}
