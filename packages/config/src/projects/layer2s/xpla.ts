import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const xpla: Layer2 = upcomingL2({
  id: 'xpla',
  display: {
    name: 'zkXPLA',
    slug: 'xpla',
    description:
    "XPLA is a global content powerhouse acting as the hub for digital media. The zkXPLA chain, built on zkSync's ZK Stack technology, will optimize the deployment of games by publishers and developers and offer a seamless end-to-end gaming environment.",
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://xpla.io'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/XPLA_Official'],
    },
  },
})
