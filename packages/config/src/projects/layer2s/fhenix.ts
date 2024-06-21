import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const fhenix: Layer2 = upcomingL2({
  id: 'fhenix',
  display: {
    name: 'Fhenix',
    slug: 'fhenix',
    description:
      'Fhenix is Fully Homomorphic Encryption rollup, build on top of Arbitrum Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://www.fhenix.io/'],
      apps: [],
      documentation: [
        'https://www.fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/',
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
