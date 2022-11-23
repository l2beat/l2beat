import { ProjectId } from '@l2beat/types'

import {
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
  validatedBy?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export interface BridgeTechnology {
  canonical?: boolean
  category: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
  destination: string[]
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
}
