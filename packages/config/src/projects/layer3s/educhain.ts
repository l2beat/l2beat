import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const educhain: Layer3 = upcomingL3({
  id: 'educhain',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.RaaS.Gelato],
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
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/opencampus_xyz'],
    },
  },
})
