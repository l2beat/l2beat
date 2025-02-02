import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const prom: Layer2 = upcomingL2({
  id: 'prom',
  capability: 'universal',
  addedAt: new UnixTime(1738459410582), // 2025-02-01T15:23:30Z
  display: {
    name: 'Prom',
    slug: 'prom',
    description:
      'Prom is the primary access point to the Web3 gaming ecosystem, a cutting-edge Zero-Knowledge (ZK) blockchain developed using the Polygon CDK.',
    purposes: ['Gaming', 'NFT'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['http://prom.io/'],
      apps: ['https://prom.io/bridge'],
      documentation: ['https://prom.gitbook.io/'],
      explorers: ['https://promscan.io/'],
      repositories: [],
      socialMedia: [
        'https://t.me/prom_io',
        'https://twitter.com/prom_io',
        'https://discord.gg/prom',
        'http://instagram.com/prom_io_official',
        'https://medium.com/@prom-io',
      ],
    },
  },
})
