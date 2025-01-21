import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const capx: Layer2 = upcomingL2({
  id: 'capx',
  createdAt: new UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is a sector-specific Layer 2 blockchain, specialized for token distribution and trading, facilitating curated distributions for project communities, token streaming for investor distributions, and a liquid secondary market for tokens.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://capx.fi/'],
      apps: ['https://app.capxai.org/'],
      documentation: ['https://capx.gitbook.io/docs'],
      explorers: ['https://explorer.palm.io/'],
      repositories: [],
      socialMedia: [
        'https://discord.com/invite/HAGATNqT8J',
        'https://twitter.com/capxfi',
        'https://t.me/capxfi',
      ],
    },
  },
})
