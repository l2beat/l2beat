import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const vessel: Layer3 = upcomingL3({
  id: 'vessel',
  capability: 'universal',
  addedAt: new UnixTime(1740996247),
  hostChain: ProjectId('scroll'),
  display: {
    name: 'Vessel',
    slug: 'vessel',
    category: 'ZK Rollup',
    description:
      'Vessel is an All-in-one on-chain exchange platform dedicated to providing superior services in spot trading, perpetual trading, and an enhanced AMM DEX, ensuring an unparalleled trading experience for users.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://vessel.finance/'],
      apps: ['https://trade.vessel.finance/'],
      documentation: ['https://vesselfinance.gitbook.io/vessel'],
      explorers: [],
      socialMedia: [
        'https://x.com/vesselfinance',
        'https://t.me/vesselfinance',
        'https://discord.com/invite/vesselfinance',
        'https://medium.com/@vessel_finance',
      ],
    },
  },
})
