import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const tusima: Layer2 = upcomingL2({
  id: 'tusima',
  capability: 'universal',
  addedAt: new UnixTime(1738142567), // 2025-01-29T15:22:47Z
  display: {
    name: 'Tusima',
    slug: 'tusima',
    description:
      'Tusima is an infrastructure that bridges Web3.0 and real-world business. It aims to be a consumer payment network for any asset.',
    purposes: ['Universal', 'Payments'],
    category: 'Validium',
    stack: 'Polygon',
    links: {
      websites: ['https://tusima.network/'],
      apps: ['https://tusima.network/Galactic/Withdraw'],
      documentation: ['https://docs.tusima.network/'],
      explorers: [],
      repositories: ['https://github.com/TusimaNetwork'],
      socialMedia: [
        'https://x.com/TusimaNetwork',
        'https://t.me/tusimaofficial',
        'https://discord.com/invite/yB3SWxTRej',
        'https://medium.com/@TusimaNetwork',
      ],
    },
  },
})
