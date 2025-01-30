import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const align: Layer2 = upcomingL2({
  id: 'align',
  capability: 'universal',
  addedAt: new UnixTime(1719931843), // 2024-07-02T14:50:43Z
  display: {
    name: 'Align Network',
    slug: 'align',
    description:
      'Align Network is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It focuses on providing a decentralized identity and verification layer for social interactions.',
    purposes: ['Social'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://align.network/'],
      documentation: ['https://docs.align.network/docs/getting-started'],
      repositories: ['https://github.com/alignnetwork'],
      socialMedia: [
        'https://x.com/align_network',
        'https://discord.com/invite/KCSkfqW5js',
        'https://warpcast.com/~/channel/align',
      ],
    },
  },
})
