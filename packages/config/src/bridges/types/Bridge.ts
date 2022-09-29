import { ProjectId } from '@l2beat/types'

import {
  News,
  ProjectContracts,
  ProjectEscrow,
  ProjectLinks,
  ProjectRiskViewEntry,
  ProjectTechnologyChoice,
} from '../../common'
import { Layer2Permission } from '../../layer2s'

export interface Bridge {
  type: 'bridge'
  id: ProjectId
  display: BridgeDisplay
  config: BridgeConfig
  riskView?: {
    validation?: ProjectRiskViewEntry
    sourceUpgradeability?: ProjectRiskViewEntry
    destinationToken?: ProjectRiskViewEntry
  }
  technology: BridgeTechnology
  contracts?: ProjectContracts
  permissions?: Layer2Permission[]
  news?: News[]
}

export interface BridgeDisplay {
  name: string
  slug: string
  description?: string
  links: Partial<ProjectLinks>
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: ProjectEscrow[]
}

export interface BridgeTechnology {
  canonical?: boolean
  type: string
  destination: string[]
  // TODO: replace them with actual values
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
}
