import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const lumiterra: Layer3 = upcomingL3({
  id: 'lumiterra',
  capability: 'universal',
  addedAt: new UnixTime(1728665516),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Lumiterra',
    slug: 'lumiterra',
    category: 'Optimium',
    description:
      'Lumiterra is a multiplayer open-world survival crafting game built on L3 Arbitrum Orbit chain.',
    purposes: ['Gaming'],
    stack: 'Arbitrum',
    links: {
      websites: ['https://lumiterra.net/'],
      apps: ['https://bridge.layerlumi.com/?l2ChainId=94168'],
      documentation: [
        'https://docs.lumiterra.net/docs/overview/mainnet-beta/beta-test-arbiturm',
      ],
      socialMedia: [
        'https://x.com/LumiterraGame',
        'https://discord.com/invite/q3P5hjqsuE',
      ],
    },
  },
})
