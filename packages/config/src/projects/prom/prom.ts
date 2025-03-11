import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const prom: ScalingProject = upcomingL2({
  id: 'prom',
  capability: 'universal',
  addedAt: UnixTime(1741702000),
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
