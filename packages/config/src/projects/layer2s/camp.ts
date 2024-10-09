import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const camp: Layer2 = upcomingL2({
  id: 'camp',
  createdAt: new UnixTime(1714294159), // '2024-04-28T08:49:19Z'
  display: {
    name: 'Camp',
    slug: 'camp',
    description:
      'Camp is an Ethereum layer 2 designed for entertainment applications, based on the OP stack and utilizing Celestia for data availability.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://campnetwork.xyz/'],
      apps: ['https://camp-testnet-bridge.vercel.app/'],
      documentation: ['https://campaign-1.gitbook.io/camp-technical-docs'],
      explorers: [
        'https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Camp_L2',
        'https://discord.com/invite/GDQRjR2PrY',
      ],
    },
  },
})
