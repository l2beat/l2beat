import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const wonderfi: Layer2 = upcomingL2({
  id: 'wonderfi',
  capability: 'universal',
  addedAt: new UnixTime(1740073109), // 2025-01-20T17:38:29Z
  display: {
    name: 'WonderFi',
    slug: 'wonderfi',
    description:
      "WonderFi provides access to DeFi through ZKsync's Ethereum-level security, with scalability and cost-efficiency.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://labs.wonder.fi/'],
      documentation: ['https://docs.wonderchain.org/'],
      explorers: ['https://explorer.testnet.wonderchain.org/'],
      socialMedia: ['https://x.com/WonderFiLabs'],
    },
  },
})
