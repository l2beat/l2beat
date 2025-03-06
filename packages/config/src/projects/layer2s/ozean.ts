import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const ozean: Layer2 = upcomingL2({
  id: 'ozean',
  capability: 'universal',
  addedAt: UnixTime(1739946099),
  display: {
    name: 'Ozean',
    slug: 'ozean',
    description:
      "Ozean is Clearpool's new Layer 2 blockchain focused on integrating RWAs into DeFi. Built on the OP Stack.",
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://ozean.finance/'],
      documentation: ['https://docs.ozean.finance/'],
      apps: ['https://app.ozean.finance/bridge'],
      explorers: [],
      repositories: ['https://github.com/clearpool-finance'],
      socialMedia: [
        'https://twitter.com/ClearpoolFin',
        'https://t.me/clearpoolofficial',
        'https://clearpool.medium.com/',
        'https://discord.com/invite/YYzxscA4nu',
      ],
    },
  },
})
