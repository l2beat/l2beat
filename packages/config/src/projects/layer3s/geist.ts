import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import type { Layer3 } from './types'

export const geist: Layer3 = upcomingL3({
  id: 'geist',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('base'),
  display: {
    name: 'Geist',
    slug: 'geist',
    description:
      'Geist is an upcoming Layer 3 on Base, built on the Orbit stack. It is focused on creating a better gaming and metaverse experience.',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://playongeist.com/'],
      apps: [],
      documentation: ['https://docs.playongeist.com/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/aavegotchi',
        'https://dapp.aavegotchi.com/?utm_source=geist',
      ],
    },
  },
})
