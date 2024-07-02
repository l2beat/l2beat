import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const apechain: Layer3 = upcomingL3({
  id: 'apechain',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.RaaS.Caldera],
  display: {
    name: 'ApeChain',
    slug: 'apechain',
    description:
      'ApeChain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It scales $APE and supports the growth of the ApeCoin ecosystem. Powered by the $APE token and the home of assets and games in the ApeCoin ecosystem with development and growth led by Horizen Labs. ',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://apecoin.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/apecoin'],
    },
  },
})
