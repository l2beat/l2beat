import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const oev: Layer2 = upcomingL2({
  id: 'oev',
  createdAt: new UnixTime(1707313169), // 2024-02-07T13:39:29Z
  display: {
    name: 'OEV Network',
    slug: 'oev',
    description:
      'OEV is an upcoming Optimium by API3, built with Arbitrum orbit stack. It is designed to capture oracle extractable value and return it to the dApps and their users that generated it.',
    purposes: ['Oracles'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://api3.org/oev/'],
      apps: [],
      documentation: [
        'https://medium.com/api3/api3-builds-oev-network-on-arbitrum-orbit-b29f8f5d7dcf',
      ],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/OEVNetwork',
        'https://discord.com/invite/api3dao',
        'https://medium.com/api3',
      ],
    },
  },
})
