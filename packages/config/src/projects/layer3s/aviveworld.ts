import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const aviveworld: Layer3 = upcomingL3({
  id: 'aviveworld',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.RaaS.Caldera],
  display: {
    name: 'Avive World',
    slug: 'avive-world',
    description:
      'Avive World is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It focuses on creating a new decentralized social world by empowering geonetworking depin protocols and onboarding millions to Web3.',
    purposes: ['Social'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://avive.world/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Avive_World'],
    },
  },
})
