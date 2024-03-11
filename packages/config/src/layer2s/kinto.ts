import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const kinto: Layer2 = underReviewL2({
  id: 'kinto',
  display: {
    name: 'Kinto',
    slug: 'kinto',
    description:
      'Kinto is the first KYCed Layer 2 capable of supporting both modern financial institutions and decentralized protocols.',
    purposes: ['DeFi'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://kinto.xyz'],
      apps: [],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://test-explorer.kinto.xyz/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.gg/utEYFxKFgB',
        'https://mirror.xyz/kintoxyz.eth',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB'),
      sinceTimestamp: new UnixTime(1702607855),
      tokens: '*',
    },
  ],
})
