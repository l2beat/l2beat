import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const fhenix: Layer2 = upcomingL2({
  id: 'fhenix',
  addedAt: new UnixTime(1719225560), // 2024-06-24T10:39:20Z
  display: {
    name: 'Fhenix',
    slug: 'fhenix',
    description:
      'Fhenix is Fully Homomorphic Encryption rollup, build on top of Arbitrum Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://fhenix.io/'],
      apps: [],
      documentation: [
        'https://fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/',
      ],
      explorers: [],
      repositories: ['https://github.com/orgs/FhenixProtocol/'],
      socialMedia: [
        'https://x.com/FhenixIO',
        'https://discord.com/invite/FuVgxrvJMY',
      ],
    },
  },
})
