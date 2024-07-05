import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const oursong: Layer3 = upcomingL3({
  id: 'oursong',
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.VM.EVM, Badge.Stack.Orbit],
  display: {
    name: 'Oursong',
    slug: 'oursong',
    description:
      'Oursong is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is transforming the music industry with an automated copyright management system designed for the AI era, streamlining registration, licensing, and royalty distribution for the next generation of one billion creators.',
    purposes: ['Music'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://oursong.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/oursong'],
    },
  },
})
