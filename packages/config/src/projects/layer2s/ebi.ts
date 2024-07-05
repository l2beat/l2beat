import { Badge } from '../badges'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const ebi: Layer2 = upcomingL2({
  id: 'ebi',
  badges: [Badge.VM.EVM, Badge.Stack.Orbit],
  display: {
    name: 'Ebi',
    slug: 'ebi',
    description:
      'Ebi is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is built to unlock liquidity for all tokens. DeFi perps dex built by the Figaro labs team.',
    purposes: ['DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://ebi.xyz/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/ebixyzdex'],
    },
  },
})
