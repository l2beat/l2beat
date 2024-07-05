import { Badge } from '../badges'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const alephzero: Layer2 = upcomingL2({
  id: 'alephzero',
  badges: [Badge.VM.EVM, Badge.RaaS.Gelato, Badge.Stack.Orbit],
  display: {
    name: 'Aleph Zero',
    slug: 'aleph-zero',
    description:
      'Aleph Zero is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It will enable you to build and use unique privacy apps with the speed and UX that you love.',
    purposes: ['Privacy'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alephzero.org/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
  },
})
