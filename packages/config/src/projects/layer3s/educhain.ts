import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const educhain: Layer3 = upcomingL3({
  id: 'educhain',
  createdAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'EDU',
    slug: 'edu-chain',
    description:
      'EDU Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is designed to onboard real-world educational economies to blockchain and establish an innovative “Learn Own Earn” model for education.',
    purposes: ['Social'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://opencampus.xyz/'],
      apps: [],
      documentation: ['https://userdocs.opencampus.xyz'],
      explorers: [],
      repositories: ['https://github.com/opencampus-xyz'],
      socialMedia: ['https://x.com/opencampus_xyz'],
    },
  },
})
