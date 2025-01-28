import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const zentachain: Layer2 = upcomingL2({
  id: 'zentachain',
  capability: 'universal',
  addedAt: new UnixTime(1706277671), // 2024-01-26T14:01:11Z
  display: {
    name: 'Zentachain',
    slug: 'zentachain',
    description:
      'Zentachain is a privacy-focused IoT blockchain networking project that is focused on communication and data storage. Innovative and useful solutions are provided for issues of security and data ownership.',
    purposes: ['Universal', 'Privacy'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://zentachain.io/'],
      apps: ['https://sepolia-bridge.zentachain.io/'],
      documentation: ['https://docs.zentachain.io/'],
      explorers: ['https://explorer-sepolia.zentachain.io/'],
      repositories: ['https://github.com/ZentaChain'],
      socialMedia: [
        'https://twitter.com/zentachain',
        'https://discord.com/invite/TR5bv3e8Ny',
        'https://zentachain.blog/',
        'https://t.me/ZentachainOfficialChat',
        'https://reddit.com/r/Zentachain/',
      ],
    },
  },
})
