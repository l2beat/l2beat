import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const everclear: Layer2 = upcomingL2({
  id: 'everclear',
  display: {
    name: 'Everclear',
    slug: 'everclear',
    description:
      'Everclear is an upcoming Layer 2 on Ethereum, built on the Orbit stack and EigenDA. It aims to coordinate settlement of liquidity between chains and solve fragmentation for modular blockchains.',
    purposes: ['Interoperability'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://everclear.org'],
      apps: [],
      documentation: ['https://docs.everclear.org'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/everclearorg',
        'https://discord.gg/everclear',
        'https://blog.everclear.org/',
      ],
    },
  },
})
