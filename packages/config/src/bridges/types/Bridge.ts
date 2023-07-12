import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Milestone,
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
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  display: BridgeDisplay
  config: BridgeConfig
  riskView?: BridgeRiskView
  technology: BridgeTechnology
  contracts?: ProjectContracts
  permissions?: ProjectPermission[] | 'UnderReview'
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface BridgeDisplay {
  name: string
  slug: string
  warning?: string
  description?: string
  category: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
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
  destination: string[]
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
  isUnderReview?: boolean
}
