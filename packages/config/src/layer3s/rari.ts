import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../common'
import { Layer3 } from './types'

export const rari: Layer3 = {
  isUnderReview: true,
  type: 'layer3',
  id: ProjectId('rari'),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'RARI Chain',
    slug: 'rari',
    description:
      'RARI Chain embeds royalties on the node level to guarantee royalty payments. A secure, low-cost, decentralized Ethereum L3 blockchain powered by Arbitrum.',
    purposes: ['NFT'],
    category: 'Optimium',
    provider: 'Arbitrum Orbit',
    links: {
      websites: ['https://rarichain.org/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=rari-mainnet&sourceChain=arbitrum-one',
      ],
      documentation: ['https://rari.docs.caldera.dev/'],
      explorers: ['https://mainnet.explorer.rarichain.org/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: ['https://twitter.com/RariChain'],
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
