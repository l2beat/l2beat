import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const unichain: Layer2 = upcomingL2({
  id: 'unichain',
  createdAt: new UnixTime(1728932992), // 2024-10-14T19:09:00Z
  display: {
    name: 'Unichain',
    slug: 'unichain',
    description:
      'Unichain, a faster, cheaper L2 designed to be the home for DeFi and the home for multichain liquidity.',
    purposes: ['Universal', 'Exchange'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://unichain.org/'],
      apps: ['https://unichain.org/bridge'],
      documentation: ['https://docs.unichain.org/docs'],
      explorers: ['https://unichain-sepolia.blockscout.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/unichain',
        'https://discord.com/invite/uniswap',
      ],
    },
  },
})
