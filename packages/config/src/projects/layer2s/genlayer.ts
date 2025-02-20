import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const genlayer: Layer2 = upcomingL2({
  id: 'genlayer',
  capability: 'universal',
  addedAt: new UnixTime(1740073213), // 2025-01-20T17:40:13Z
  display: {
    name: 'GenLayer',
    slug: 'genlayer',
    description:
      "GenLayer is the first AI-native blockchain built for AI-powered smart contracts",
    purposes: ['Universal', 'AI'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://www.genlayer.com/'],
      documentation: ['https://docs.genlayer.com/'],
      explorers: ['https://genlayer-testnet.explorer.caldera.xyz/'],
      socialMedia: [
        'https://x.com/GenLayer',
      ],
    },
  },
})
