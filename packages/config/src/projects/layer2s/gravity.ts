import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const gravity: Layer2 = upcomingL2({
  id: 'gravity',
  display: {
    name: 'Gravity',
    slug: 'gravity',
    description:
      'Gravity is an upcoming Layer 2 by Galxe team, built on the Orbit stack aiming to evolve into Layer 1 PoS chain',
    purposes: ['Community'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://gravity.xyz'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/GravityChain',
        'https://discord.com/invite/GravityChain',
        'https://t.me/GravityChain',
      ],
    },
  },
})
