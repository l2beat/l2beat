import { ProjectId } from '@l2beat/types'

import {
  News,
  ProjectEscrow,
  ProjectLinks,
  ProjectRiskViewEntry,
} from '../../common'

export interface Bridge {
  id: ProjectId
  display: BridgeDisplay
  config: BridgeConfig
  technology: BridgeTechnology
  riskView?: {
    validation: ProjectRiskViewEntry
    sourceUpgradeability: ProjectRiskViewEntry
    destinationToken: ProjectRiskViewEntry
  }
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
  validation: string
  type: string
  destination: string[]
  connections: {
    network: string
    tokens: string[]
  }[]
}
