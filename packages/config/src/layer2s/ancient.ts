import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReview } from './templates/underReview'
import { Layer2 } from './types'

export const ancient: Layer2 = underReview({
  id: 'ancient',
  display: {
    name: 'Ancient8',
    slug: 'ancient',
    description:
      'Ancient8 Chain is a gaming-focused community-driven Ethereum Layer 2 built using OP Stack.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://ancient8.gg/'],
      apps: ['https://bridge.ancient8.gg/'],
      documentation: ['https://docs.ancient8.gg/'],
      explorers: ['https://scan.ancient8.gg/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Ancient8_gg',
        'https://discord.gg/ancient8',
        'https://blog.ancient8.gg/',
        'https://t.me/ancient8_gg',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x12d4E64E1B46d27A00fe392653A894C1dd36fb80'),
      sinceTimestamp: new UnixTime(1706054400),
      tokens: '*',
    },
  ],
})
