import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const geist: Layer3 = upcomingL3({
  id: 'geist',
  createdAt: new UnixTime(1734109200), // 2024-12-13T17:00:00Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Geist',
    slug: 'geist',
    description:
      'Geist is an Ethereum layer-3 gaming network where all games on the network will be centered around, or briefly include, the Aavegotchi IP.',
    purposes: ['Gaming', 'Universal'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://playongeist.com'],
      apps: [],
      documentation: ['https://docs.playongeist.com'],
      explorers: ['https://geist-mainnet.explorer.alchemy.com'],
      repositories: [],
      socialMedia: ['https://x.com/aavegotchi'],
    },
  },
})
