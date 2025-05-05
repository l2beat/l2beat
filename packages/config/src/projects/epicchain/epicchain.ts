import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const epicchain: ScalingProject = underReviewL2({
  id: 'epicchain',
  capability: 'universal',
  addedAt: UnixTime(1745844787),
  display: {
    name: 'Epicchain',
    slug: 'epicchain',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    purposes: ['Universal'],
    description:
      'Epic chain, previously Ehternity, is a low-cost Layer 2 solution on the Superchain, designed to bring global entertainment franchises onto the blockchain.',
    links: {
      websites: ['https://epicchain.io/'],
      apps: ['https://swap.epicchain.io/'],
      explorers: ['https://ernscan.io/'],
      documentation: [],
      socialMedia: [
        'https://x.com/EpicOnChain',
        'https://t.me/epiconchain',
        'https://instagram.com/epiconchain/',
        'https://facebook.com/EpicOnChain',
      ],
    },
  },
  chainConfig: {
    name: 'epicchain',
    chainId: 183,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.ethernitychain.io',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
