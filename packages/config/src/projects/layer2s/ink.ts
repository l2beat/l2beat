import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const ink: Layer2 = upcomingL2({
  id: 'ink',
  createdAt: new UnixTime(1729797861), // 2024-10-24T21:24:21Z
  display: {
    name: 'Ink',
    slug: 'ink',
    description:
      'Ink is an Optimistic Rollup built with the OP Stack by Kraken exchange.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://inkonchain.com/en-US'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer-sepolia.inkonchain.com'],
      repositories: ['https://github.com/inkonchain'],
      socialMedia: [
        'https://x.com/inkonchain',
        'https://discord.com/invite/inkonchain',
        'https://t.me/inkonchain',
      ],
    },
  },
})
