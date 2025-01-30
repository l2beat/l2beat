import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Layer3 } from '../../types'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const dodochain: Layer3 = underReviewL3({
  id: 'dodochain',
  capability: 'universal',
  addedAt: new UnixTime(1719224565), // 2024-06-24T10:22:45Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'DODOchain',
    slug: 'dodochain',
    category: 'Optimium',
    description:
      'DODOchain is an Omni-Trading Layer-3 connecting liquidity from all chains including BTC and ETH L2s.',
    purposes: ['Universal', 'Interoperability'],
    stack: 'Arbitrum',
    links: {
      websites: ['https://dodochain.com/'],
      documentation: ['https://docs.dodochain.com/en/dodochain'],
      repositories: ['https://github.com/DODOEX'],
      socialMedia: [
        'https://x.com/DODO_Chain',
        'https://medium.com/@DODOchain',
        'https://t.me/dodoex_official',
        'https://discord.com/invite/tyKReUK',
      ],
    },
  },
})
