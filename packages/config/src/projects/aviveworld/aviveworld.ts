import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const aviveworld: ScalingProject = upcomingL3({
  id: 'aviveworld',
  capability: 'universal',
  addedAt: UnixTime(1719939717), // 2024-07-02T17:01:57Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Avive World',
    slug: 'avive-world',
    description:
      'Avive World is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It focuses on creating a new decentralized social world by empowering geonetworking depin protocols and onboarding millions to Web3.',
    purposes: ['Social'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://avive.world/'],
      socialMedia: ['https://twitter.com/Avive_World'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
