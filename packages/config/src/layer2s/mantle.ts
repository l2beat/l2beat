import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, makeBridgeCompatible,TECHNOLOGY } from './common'
import { RISK_VIEW } from './common/riskView';
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantle')

export const mantle: Layer2 = {
  type: 'layer2',
  id: ProjectId('mantle'),
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is an EVM compatible optimistic chain that has been designed for use on the Ethereum network, based on the Optimism OVM architecture.',
    purpose: 'Universal',
    category: 'Optimistic Chain',
    provider: 'Optimism',
    links: {
      websites: ['https://www.mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['MNT'],
    escrows: [
      {
        // L1StandardBridge
        address: EthereumAddress('0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012'),
        sinceTimestamp: new UnixTime(1687954103),
        tokens: '*',
      }
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://rpc.mantle.xyz',
      callsPerMinute: 1500,
      excludeFromActivityApi: true,
    }
  },
  stage: {
    stage: 'UnderReview',
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL,
      sources: [
        {
          contract: 'EigenDataLayerChain',
          references: [ // The contract that is supposed to perfrom the signature check is not verified!
            'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L328'
          ]
        }
      ]
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'L1CrossDomainMessenger',
          references: [
            'https://etherscan.io/address/0x676A795fe6E43C17c668de16730c3F690FEB7120#code'
          ]
        }
      ]
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L210'
          ]
        }
      ]
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'StateCommitmentChain',
          references: [
            'https://etherscan.io/address/0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa#code#F1#L111', // isCollateralized call
            'https://etherscan.io/address/0x31aBe1c466C2A8b95fd84258dD1471472979B650#code#F1#L31' // dummy isCollateralized function
          ]
        }
      ]
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('MNT'),
  }),
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
