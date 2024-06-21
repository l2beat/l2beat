import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const dodochain: Layer3 = underReviewL3({
  id: 'dodochain',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'DODOchain',
    slug: 'dodochain',
    category: 'Optimium',
    description:
      'DODOchain is an Omni-Trading Layer-3 connecting liquidity from all chains including BTC and ETH L2s.',
    purposes: ['DeFi'],
    provider: 'Arbitrum',
    links: {
      websites: ['https://www.dodochain.com/'],
      apps: [],
      documentation: ['https://docs.dodochain.com/en/dodochain'],
      explorers: [],
      repositories: ['https://github.com/DODOEX'],
      socialMedia: [
        'https://x.com/DODO_Chain',
        'https://medium.com/@DODOchain',
        'https://t.me/dodoex_official',
        'https://discord.com/invite/tyKReUK',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
})
