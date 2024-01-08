import { BridgeRiskView } from '../bridges'
import { ProjectRiskViewEntry } from './ProjectRisk'

export interface ProjectRiskView extends Required<BridgeRiskView> {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  exitWindow: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  proposerFailure: ProjectRiskViewEntry
}
