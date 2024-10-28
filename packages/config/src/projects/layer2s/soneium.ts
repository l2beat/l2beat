import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const soneium: Layer2 = upcomingL2({
  id: 'soneium',
  createdAt: new UnixTime(1724842746), // 2024-08-28T10:59:06Z
  display: {
    name: 'Soneium',
    slug: 'soneium',
    description:
      'Soneium is an upcoming Optimistic rollup based on the OP Stack. It is built by Sony Block Solutions Labs and planned to stand as a versatile, general-purpose blockchain.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://soneium.org/en/'],
      apps: ['https://bridge.soneium.org/en/testnet'],
      documentation: ['https://soneium.org/en/docs/'],
      explorers: ['https://explorer-testnet.soneium.org/'],
      repositories: ['https://github.com/Soneium'],
      socialMedia: [
        'https://x.com/soneium',
        'https://t.me/SoneiumOfficial',
        'https://discord.gg/rWWPBHug9w',
      ],
    },
  },
})
