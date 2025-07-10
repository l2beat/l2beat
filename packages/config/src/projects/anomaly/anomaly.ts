import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const anomaly: ScalingProject = upcomingL3({
  id: 'anomaly',
  capability: 'universal',
  addedAt: UnixTime(1719939717), // 2024-07-02T17:01:57Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Anomaly Network',
    slug: 'anomaly',
    description:
      'Anomaly Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It focuses on reimagining a decentralized AI gaming world and cultivates an ecosystem where boundless development results in players experiencing games that are as intelligent as they are thrilling.',
    purposes: ['Gaming', 'AI'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://anomalygames.ai/'],
      documentation: ['https://docs.anomalygames.ai/'],
      socialMedia: ['https://twitter.com/anomalygamesinc'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
