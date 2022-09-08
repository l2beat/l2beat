import { ProjectId } from '@l2beat/types'

import { Layer2RiskViewEntry, News } from '../../layer2s'
import { RISK_VIEW } from '../../layer2s/common'
import { Layer2 } from '../../layer2s/types/Layer2'
import { Layer2Escrow } from '../../layer2s/types/Layer2Escrow'
import { Layer2Links } from '../../layer2s/types/Layer2Links'

export interface BridgeDescription {
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

export function bridge(bridge: BridgeDescription): Layer2 {
  return {
    name: bridge.name,
    id: ProjectId(bridge.slug),
    slug: bridge.slug,
    escrows: bridge.escrows,
    associatedTokens: bridge.associatedTokens,
    details: {
      description: bridge.description ?? '.',
      purpose: bridge.validation,
      links: {
        websites: [],
        apps: [],
        documentation: [],
        explorers: [],
        repositories: [],
        socialMedia: [],
        ...bridge.links,
      },
      riskView: {
        stateValidation: RISK_VIEW.STATE_ZKP_SN,
        dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
        upgradeability: RISK_VIEW.UPGRADABLE_YES,
        sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS_ZKP,
        validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS_ZKP,
      },
      technology: {
        category: {
          name: 'ZK Rollup',
        },
        stateCorrectness: {
          name: '',
          description: '.',
          risks: [],
          references: [],
        },
        dataAvailability: {
          name: '',
          description: '.',
          risks: [],
          references: [],
        },
        operator: {
          name: '',
          description: '.',
          risks: [],
          references: [],
        },
        forceTransactions: {
          name: '',
          description: '.',
          risks: [],
          references: [],
        },
        exitMechanisms: [
          {
            name: '',
            description: '.',
            risks: [],
            references: [],
          },
        ],
        contracts: {
          addresses: [],
          risks: [],
        },
      },
      news: [],
    },
    events: [],
  }
}
