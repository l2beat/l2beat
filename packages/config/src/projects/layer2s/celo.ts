import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const celo: Layer2 = upcomingL2({
  id: 'celo',
  capability: 'universal',
  addedAt: new UnixTime(1718876598), // '2024-06-20T09:43:18Z'
  display: {
    name: 'Celo',
    slug: 'celo',
    description:
      'Celo announced a strategic move to integrate with the Ethereum ecosystem as an OP Stack L2.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://celo.org/'],
      documentation: ['https://docs.celo.org/'],
      explorers: ['https://explorer.celo.org/mainnet/'],
      repositories: ['https://github.com/celo-org'],
      socialMedia: ['https://x.com/Celo', 'https://discord.com/invite/celo'],
    },
  },
})
