import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  KnowledgeNugget,
  Milestone,
  ProjectTechnologyChoice,
  ScalingProjectContracts,
  ScalingProjectEscrow,
  ScalingProjectLinks,
  ScalingProjectPermission,
  ScalingProjectRiskViewEntry,
} from '../../../types'

export interface Bridge {
  type: 'bridge'
  id: ProjectId
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  display: BridgeDisplay
  config: BridgeConfig
  riskView: BridgeRiskView
  technology: BridgeTechnology
  contracts?: ScalingProjectContracts
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface BridgeDisplay {
  name: string
  shortName?: string
  slug: string
  warning?: string
  description: string
  detailedDescription?: string
  category: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
  links: Partial<ScalingProjectLinks>
  architectureImage?: string
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: ScalingProjectEscrow[]
}

export interface BridgeRiskView {
  validatedBy: ScalingProjectRiskViewEntry
  sourceUpgradeability?: ScalingProjectRiskViewEntry
  destinationToken?: ScalingProjectRiskViewEntry
}

export interface BridgeTechnology {
  canonical?: boolean
  destination: string[]
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
  isUnderReview?: boolean
}
