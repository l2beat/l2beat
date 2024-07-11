import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const align: Layer2 = upcomingL2({
  id: 'align',
  display: {
    name: 'Align Network',
    slug: 'align',
    description:
      'Align Network is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It focuses on providing a decentralized identity and verification layer for social interactions.',
    purposes: ['Social'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://align.network/'],
      apps: [],
      documentation: ['https://docs.align.network/docs/getting-started'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/align_network'],
    },
  },
})
