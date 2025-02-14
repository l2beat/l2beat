import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const evedex: Layer3 = upcomingL3({
  id: 'evedex',
  capability: 'universal',
  addedAt: new UnixTime(1739503948),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'EVEDEX',
    slug: 'evedex',
    description:
      'EVEDEX is a Perpetual DEX & Next-Gen Web3 financial ecosystem built on its own L3 blockchain.',
    purposes: ['Exchange'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['http://evedex.com/'],
      apps: ['https://demo-exchange.evedex.com/'],
      documentation: ['https://evedex.com/en-US/contracts/'],
      repositories: [],
      socialMedia: [
        'https://x.com/EveDexOfficial',
        'https://discord.gg/evedex',
        'https://t.me/OfficialEveDex',
      ],
    },
  },
})
