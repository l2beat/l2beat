import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const sxt: Layer2 = upcomingL2({
  id: 'sxt',
  display: {
    name: 'Space and Time',
    slug: 'sxt',
    description:
      "Space and Time (SxT) is a decentralized data warehouse that acts as the Verifiable Compute Layer for AI x Blockchain delivering sub-second ZK proofs onchain. Built on ZK Stack, the SxT chain will serve as the network's settlement layer and TVL hub.",
    purposes: ['Universal', 'AI'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://spaceandtime.io'],
      apps: [],
      documentation: ['https://docs.spaceandtime.io'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/sophon', 
        'https://discord.com/invite/spaceandtimeDB'
        ],
    },
  },
})
