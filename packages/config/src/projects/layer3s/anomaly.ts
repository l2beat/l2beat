import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const anomaly: Layer3 = upcomingL3({
  id: 'anomaly',
  createdAt: new UnixTime(1719939717), // 2024-07-02T17:01:57Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Anomaly Network',
    slug: 'anomaly',
    description:
      'Anomaly Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It focuses on reimagining a decentralized AI gaming world and cultivates an ecosystem where boundless development results in players experiencing games that are as intelligent as they are thrilling.',
    purposes: ['Gaming', 'AI'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://anomalygames.ai/'],
      apps: [],
      documentation: ['https://docs.anomalygames.ai/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/anomalygamesinc'],
    },
  },
})
