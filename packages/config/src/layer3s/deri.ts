import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../common'
import { Layer3 } from './types'

export const deri: Layer3 = {
  type: 'layer3',
  isUnderReview: true,
  id: ProjectId('deri'),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    purposes: ['DeFi'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum Orbit',
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
    dataAvailabilityMode: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  contracts: CONTRACTS.EMPTY,
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
}
