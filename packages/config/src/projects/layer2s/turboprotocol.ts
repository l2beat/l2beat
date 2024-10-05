import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const turboprotocol: Layer2 = upcomingL2({
  id: 'turboprotocol',
  display: {
    name: 'Turbo Protocol',
    slug: 'turboprotocol',
    description:
      'Turbo Protocol is a Ethereum scaling solution offers interactive query speeds for AI dapps in the Ethereum ecosystem.',
    purposes: ['Universal', 'AI'],
    category: 'Validium',
    links: {
      websites: ['https://turboprotocol.xyz/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/TurboProtocol'],
    },
  },
})
