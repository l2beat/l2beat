import { ProjectId } from '@l2beat/types'

import { Layer2RiskViewEntry, News } from '../../layer2s'
import { Layer2Escrow } from '../../layer2s/types/Layer2Escrow'
import { Layer2Links } from '../../layer2s/types/Layer2Links'

export interface Bridge {
  id: ProjectId
  name: string
  slug: string
  validation: string
  type: string
  canonical?: boolean
  description?: string
  destination: string[]
  links: Partial<Layer2Links>
  associatedTokens?: string[]
  escrows: Layer2Escrow[]
  connections: {
    network: string
    tokens: string[]
  }[]
  risks?: {
    validation: Layer2RiskViewEntry
    sourceUpgradeability: Layer2RiskViewEntry
    destinationToken: Layer2RiskViewEntry
  }
  news?: News[]
}
