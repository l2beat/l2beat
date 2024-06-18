import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const payy: Layer2 = upcomingL2({
  id: 'payy',
  display: {
    name: 'Payy',
    slug: 'payy',
    description:
      'Payy is an app-specific zk-rollup enabling privacy and scalability for payments and DeFi.',
    purposes: ['Payments', 'DeFi'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://payy.network/'],
      apps: ['https://payy.link/download'],
      documentation: ['https://payy.network/docs'],
      explorers: ['https://payy.network/explorer'],
      repositories: ['https://github.com/polybase/payy'],
      socialMedia: ['https://x.com/payy_link'],
    },
  },
})
