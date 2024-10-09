import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const neva: Layer2 = upcomingL2({
  id: 'neva',
  display: {
    name: 'Neva',
    slug: 'neva',
    description:
      'Neva is an EVM-equivalent ZK-application network that provides scalability through Celestia DA and Polygon zkEVM, transforming GameFi and streamlining DeFi.',
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    links: {
      websites: ['https://neva.network/'],
      apps: [],
      documentation: ['https://docs.neva.network/'],
      explorers: [],
      repositories: ['https://github.com/NevaNetwork'],
      socialMedia: ['https://x.com/NevaNetwork', 'https://t.me/NevaPortal'],
    },
  },
})
