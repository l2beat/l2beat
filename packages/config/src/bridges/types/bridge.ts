import { ProjectId } from '@l2beat/types'

import { RISK_VIEW } from '../../layer2s/common'
import { Layer2 } from '../../layer2s/types/Layer2'
import { BridgeDescription } from './BridgeDescription'

export function bridgeToLayer2(bridge: BridgeDescription): Layer2 {
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
