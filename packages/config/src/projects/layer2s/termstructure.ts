import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('termstructure')

export const termstructure: Layer2 = underReviewL2({
  id: ProjectId('termstructure'),
  display: {
    name: 'Term Structure',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['DeFi', 'Lending'],
    category: 'ZK Rollup',
    provider: 'zkSync Lite',
    links: {
      websites: ['https://ts.finance/'],
      apps: ['https://app.ts.finance/'],
      documentation: ['https://docs.ts.finance/'],
      explorers: ['https://explorer.ts.finance/'],
      repositories: ['https://github.com/term-structure/'],
      socialMedia: [
        'https://twitter.com/TermStructLabs',
        'https://discord.gg/VnyTqGBSzK',
        'https://t.me/termstructure',
        'https://youtube.com/@termstructurelabs',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  escrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x09E01425780094a9754B2bd8A3298f73ce837CF9'),
      sinceTimestamp: new UnixTime(1716263903),
      tokens: '*',
    }),
  ],
})
