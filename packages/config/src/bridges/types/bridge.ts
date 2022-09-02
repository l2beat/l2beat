import { ProjectId } from '@l2beat/types'

import { News, ProjectRiskViewEntry } from '../../projects'
import { RISK_VIEW } from '../../projects/common'
import { Project } from '../../projects/types/Project'
import { ProjectBridge } from '../../projects/types/ProjectBridge'
import { ProjectLinks } from '../../projects/types/ProjectLinks'

export interface BridgeDescription {
  name: string
  slug: string
  validation: string
  description?: string
  links: Partial<ProjectLinks>
  associatedTokens?: string[]
  escrows: ProjectBridge[]
  connections: {
    network: string
    tokens: string[]
  }[]
  risks?: {
    sourceOwnership: ProjectRiskViewEntry
    sourceUpgradeability: ProjectRiskViewEntry
    destinationOwnership: ProjectRiskViewEntry
    destinationUpgradeability: ProjectRiskViewEntry
  }
  news?: News[]
}

export function bridge(bridge: BridgeDescription): Project {
  return {
    name: bridge.name,
    id: ProjectId(bridge.slug),
    slug: bridge.slug,
    bridges: bridge.escrows,
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
          name: 'Bridge',
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
