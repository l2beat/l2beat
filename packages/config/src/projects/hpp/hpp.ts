import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const hpp: ScalingProject = upcomingL2({
  id: 'hpp',
  capability: 'universal',
  addedAt: UnixTime(1753945535),
  display: {
    name: 'HPP',
    slug: 'hpp',
    description:
      'HPP is an AI-ready Layer 2 for agents, data, and decentralized infrastructure — composable and verifiable by design.',
    purposes: ['AI'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://hpp.io/'],
      explorers: ['https://sepolia-explorer.hpp.io/'],
      documentation: ['https://docs.hpp.io/'],
      socialMedia: [
        'https://x.com/aergo_io',
        'https://medium.com/aergo',
        'https://t.me/aergoofficial',
      ],
    },
  },
})
