import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const zkcandy: Layer2 = upcomingL2({
  id: 'zkcandy',
  addedAt: new UnixTime(1706088230), // 2024-01-24T09:23:50Z
  display: {
    name: 'zkCandy',
    slug: 'zkcandy',
    description:
      "zkCandy is an L2 Gaming Hyperchain built on ZKsync's ZK stack for the next generation of GameFi - Supercharged by iCandy, the largest game developer in ANZ and SEA.",
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://zkcandy.io', 'https://icandy.io/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/zkCandyHQ',
        'https://discord.gg/zkcandy',
        'https://t.me/zkcandy',
      ],
    },
  },
})
