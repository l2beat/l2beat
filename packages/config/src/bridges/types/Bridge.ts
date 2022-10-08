import { ProjectId } from '@l2beat/types'

import {
  News,
  ProjectContracts,
  ProjectEscrow,
  ProjectLinks,
  ProjectPermission,
  ProjectRiskViewEntry,
  ProjectTechnologyChoice,
} from '../../common'

export interface Bridge {
  type: 'bridge'
  id: ProjectId
  display: BridgeDisplay
  config: BridgeConfig
  riskView?: BridgeRiskView
  technology: BridgeTechnology
  contracts?: ProjectContracts
  permissions?: ProjectPermission[]
  news?: News[]
}

export interface BridgeDisplay {
  name: string
  slug: string
  warning?: string
  description?: string
  links: Partial<ProjectLinks>
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: ProjectEscrow[]
}

export interface BridgeRiskView {
  validation?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export interface BridgeTechnology {
  canonical?: boolean
  category: string
  destination: string[]
  // TODO: replace them with actual values
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
}
