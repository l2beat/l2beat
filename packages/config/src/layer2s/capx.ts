import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const capx: Layer2 = upcoming({
  id: 'capx',
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is a sector-specific Layer 2 blockchain, specialised for token distribution and trading, facilitating curated distributions for project communities, token streaming for investor distributions, and a liquid secondary market for tokens.',
    purpose: 'DeFi',
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://capx.fi/'],
      apps: ['https://app.capx.fi/explore'],
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
