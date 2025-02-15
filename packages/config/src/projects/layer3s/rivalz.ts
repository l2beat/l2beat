import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const rivalz: Layer3 = upcomingL3({
  id: 'rivalz',
  capability: 'universal',
  addedAt: new UnixTime(1739605172),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Rivalz',
    slug: 'rivalz',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Rivalz is a new chain on Arbitrum Orbit for a new service - ADCS (Agentic data coordination service).',
    purposes: ['AI'],
    links: {
      websites: ['https://rivalz.ai/'],
      apps: ['https://rivalz.ai/dashboard'],
      documentation: ['https://docs.rivalz.ai/'],
      explorers: ['https://explorer.rivalz.ai/'],
      socialMedia: [
        'https://x.com/Rivalz_AI',
        'https://discord.com/invite/rivalzai',
        'https://t.me/+1yVzpdr6hxphYmQx',
      ],
    },
  },
})
