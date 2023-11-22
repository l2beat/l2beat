import { ProjectId } from '@l2beat/shared-pure'

import { arbitrum } from './arbitrum'
import { CONTRACTS, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const deri: Layer2 = {
  type: 'layer2',
  id: ProjectId('deri'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    purpose: 'DeFi protocol',
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://deri.io/'],
      apps: [],
      documentation: ['https://docs.deri.io/'],
      explorers: ['https://explorer-dchain.deri.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/DeriProtocol',
        'https://t.me/DeriProtocol',
        'https://discord.com/invite/kb8ZbYgp8M',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: arbitrum.technology,
  contracts: CONTRACTS.EMPTY,
}
