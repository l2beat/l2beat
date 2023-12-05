import { BridgeRiskView } from '../../bridges/types'
import { ProjectRiskViewEntry } from '../../common'

export interface Layer2RiskView extends Required<BridgeRiskView> {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  exitWindow: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  proposerFailure: ProjectRiskViewEntry
}
