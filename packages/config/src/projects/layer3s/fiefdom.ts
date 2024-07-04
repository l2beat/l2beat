import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const fiefdom: Layer3 = upcomingL3({
  id: 'fiefdom',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.RaaS.Caldera],
  display: {
    name: 'Fiefdom',
    slug: 'fiefdom',
    description:
      'Fiefdom is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is dedicated to gaming and trading in the metaverse. Fiefdom is host to Fiefverse, a voxel game universe built by the Fief team, in addition to providing a permissionless environment for third-party game and DeFi developers.',
    purposes: ['Gaming', 'DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://fief.gg/fiefdom'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/fiefdomgg'],
    },
  },
})
