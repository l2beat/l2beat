import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReview } from './templates/underReview'
import { Layer2 } from './types'

export const fraxtal: Layer2 = underReview({
  id: 'fraxtal',
  display: {
    name: 'Fraxtal',
    slug: 'fraxtal',
    description:
      'Fraxtal is an EVM equivalent rollup utilizing the OP stack as its smart contract platform and execution environment.',
    purposes: ['Universal', 'DeFi'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2'),
      sinceTimestamp: new UnixTime(1706811599),
      tokens: '*',
    },
  ],
})
