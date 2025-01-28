import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const turboprotocol: Layer2 = upcomingL2({
  id: 'turboprotocol',
  capability: 'universal',
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
      socialMedia: ['https://x.com/TurboProtocol'],
    },
  },
})
