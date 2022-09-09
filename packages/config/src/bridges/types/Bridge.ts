import { ProjectId } from '@l2beat/types'

import { Layer2RiskViewEntry, News } from '../../layer2s'
import { Layer2Escrow } from '../../layer2s/types/Layer2Escrow'
import { Layer2Links } from '../../layer2s/types/Layer2Links'

export interface Bridge {
  id: ProjectId
  name: string
  slug: string
  validation: string
  description?: string
  links: Partial<Layer2Links>
  associatedTokens?: string[]
  escrows: Layer2Escrow[]
  connections: {
    network: string
    tokens: string[]
  }[]
  risks?: {
    sourceOwnership: Layer2RiskViewEntry
    sourceUpgradeability: Layer2RiskViewEntry
    destinationOwnership: Layer2RiskViewEntry
    destinationUpgradeability: Layer2RiskViewEntry
  }
  news?: News[]
}
