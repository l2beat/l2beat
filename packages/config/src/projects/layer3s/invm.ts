import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const invm: Layer3 = upcomingL3({
  id: 'invm',
  hostChain: ProjectId('arbitrum'),
  badges: [
    Badge.VM.EVM,
    Badge.Stack.Orbit,
    Badge.DA.Celestia,
    Badge.RaaS.Caldera,
  ],
  display: {
    name: 'inVM',
    slug: 'invm',
    description:
      'inVM is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It gives users access to cross-chain compatibility with Ethereum, Arbitrum, Injective, and Cosmos. Powered by the INJ token, inEVM transactions qualify for the Injective burn auction.',
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
