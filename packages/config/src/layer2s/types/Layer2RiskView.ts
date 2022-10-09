import { BridgeRiskView } from '../../bridges'
import { ProjectRiskViewEntry } from '../../common'

export interface Layer2RiskView extends BridgeRiskView {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  validatorFailure: ProjectRiskViewEntry
}
