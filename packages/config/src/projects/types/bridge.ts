import { RISK_VIEW } from '../common'
import { Project } from './Project'
import { ProjectBridge } from './ProjectBridge'
import { ProjectLinks } from './ProjectLinks'

export interface BridgeDescription {
  name: string
  slug: string
  purpose: string
  links: Partial<ProjectLinks>
  associatedTokens?: string[]
  bridges: ProjectBridge[]
}

export function bridge(bridge: BridgeDescription): Project {
  return {
    name: bridge.name,
    slug: bridge.slug,
    bridges: bridge.bridges,
    associatedTokens: bridge.associatedTokens,
    details: {
      description: '.',
      purpose: bridge.purpose,
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
  }
}
