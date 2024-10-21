import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const invm: Layer3 = upcomingL3({
  id: 'invm',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'inVM',
    slug: 'invm',
    description:
      'inVM is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It aims to give users access to cross-chain compatibility with Ethereum, Arbitrum, Injective and Cosmos. Powered by the INJ token, inEVM transactions qualify for the Injective burn auction.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://injective.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/injective'],
    },
  },
})
