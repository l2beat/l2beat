import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const alphadune: Layer3 = upcomingL3({
  id: 'alphadune',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.RaaS.Caldera, Badge.Stack.Orbit],
  display: {
    name: 'AlphaDune',
    slug: 'alphadune',
    description:
      'AlphaDune is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is a loyalty-driven network for GameFi and GambleFi.',
    purposes: ['Gaming', 'DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alphadune.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/alphadune'],
    },
  },
})
