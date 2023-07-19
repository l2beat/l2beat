import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
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
  },
  stage: {
    stage: 'UnderReview',
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
