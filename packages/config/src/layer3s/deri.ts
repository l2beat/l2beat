import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from '../layer2s'
import { Layer3 } from './types'

export const deri: Layer3 = {
  isUpcoming: false,
  isUnderReview: true,
  isArchived: false,
  type: 'layer2',
  isLayer3: true,
  id: ProjectId('deri'),
  hostChain: ProjectId('arbitrum'),
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
    dataAvailabilityMode: 'NotApplicable',
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [],
  },
  technology: TECHNOLOGY.UPCOMING,
  riskView: UNDER_REVIEW_RISK_VIEW,
  contracts: CONTRACTS.EMPTY,
}
