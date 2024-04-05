import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const termstructure: Layer2 = upcomingL2({
  id: 'termstructure',
  display: {
    name: 'Term Structure',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['DeFi'],
    category: 'ZK Rollup',
    provider: 'zkSync Lite',
    links: {
      websites: ['https://ts.finance/'],
      apps: ['https://app.testnet.ts.finance/'],
      documentation: ['https://docs.ts.finance/'],
      explorers: ['https://explorer.testnet.ts.finance/'],
      repositories: ['https://github.com/term-structure/'],
      socialMedia: [
        'https://twitter.com/TermStructLabs',
        'https://discord.gg/VnyTqGBSzK',
        'https://t.me/termstructure',
        'https://youtube.com/@termstructurelabs',
      ],
    },
  },
})
