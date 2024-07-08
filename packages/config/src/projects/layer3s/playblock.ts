import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const playblock: Layer3 = upcomingL3({
  id: 'playblock',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.Stack.Orbit, Badge.RaaS.Gelato],
  display: {
    name: 'PlayBlock',
    slug: 'playblock',
    description:
      'PlayBlock is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is built by the team behind Playnance, and is focused on gasless gaming.',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://playnance.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Playnancetech'],
    },
  },
})
