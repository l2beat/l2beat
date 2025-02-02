import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const bethel: Layer2 = upcomingL2({
  id: 'bethel',
  capability: 'universal',
  addedAt: new UnixTime(1738489070), // 2025-02-02T15:23:30Z
  display: {
    name: 'Bethel',
    slug: 'bethel',
    description:
      'Bethel Platform is an avant-garde blockchain solution designed to meet the growing demand for secure, efficient, and decentralized data management. ',
    purposes: ['Storage'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['http://bethelnet.io/'],
      apps: [],
      documentation: ['https://docs.bethelnet.io/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://linkedin.com/company/bethel-blockchain-platform/',
        'https://twitter.com/BethelPlatform',
        'https://youtube.com/channel/UCVYnUnw_tKTlhdrx5Epnz-w',
        'https://t.me/bethelplatform',
        'https://facebook.com/bethelplatform',
        'https://instagram.com/bethelplatform/',
        'https://discord.com/invite/bethelplatform'
      ],
    },
  },
})
