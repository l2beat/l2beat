import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const galxegravity: Layer2 = underReviewL2({
  id: ProjectId('galxegravity'),
  display: {
    name: 'Gravity Alpha',
    slug: 'galxegravity',
    provider: 'Arbitrum',
    description:
      'Gravity is an Optimium built on the Orbit stack.',
    purposes: ['Social'],
    category: 'Optimium',
    links: {
      websites: ['https://gravity.xyz'],
      apps: [],
      documentation: ['https://docs.gravity.xyz/'],
      explorers: ['https://explorer.gravity.xyz/'],
      repositories: ['https://github.com/Galxe'],
      socialMedia: [
        'https://x.com/GravityChain',
        'https://discord.com/invite/GravityChain',
        'https://t.me/GravityChain',
      ],
    },
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x7983403dDA368AA7d67145a9b81c5c517F364c42'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1686211235),
      tokens: '*',
    },
  ],
})
