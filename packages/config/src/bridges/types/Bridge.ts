import { ProjectId } from '@l2beat/types'

import { Layer2RiskViewEntry, News } from '../../layer2s'
import { Layer2Escrow } from '../../layer2s/types/Layer2Escrow'
import { Layer2Links } from '../../layer2s/types/Layer2Links'

export interface Bridge {
  id: ProjectId
  display: BridgeDisplay
  config: BridgeConfig
  technology: BridgeTechnology
  riskView?: {
    validation: Layer2RiskViewEntry
    sourceUpgradeability: Layer2RiskViewEntry
    destinationToken: Layer2RiskViewEntry
  }
  news?: News[]
}

export interface BridgeDisplay {
  name: string
  slug: string
  description?: string
  links: Partial<Layer2Links>
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: Layer2Escrow[]
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
