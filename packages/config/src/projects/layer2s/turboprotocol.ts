import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const turboprotocol: Layer2 = upcomingL2({
  id: 'turboprotocol',
  addedAt: new UnixTime(1728666437),
  display: {
    name: 'Turbo Protocol',
    slug: 'turboprotocol',
    description:
      'Turbo Protocol is an Ethereum scaling solution that will offer interactive query speeds for AI dApps in the Ethereum ecosystem.',
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
