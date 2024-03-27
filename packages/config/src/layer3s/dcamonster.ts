import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const bugless: Layer3 = underReviewL3({
  id: 'dca-monster',
  hostChain: 'Multiple',
  display: {
    name: 'DCA.Monster',
    slug: 'dca-monster',
    description:
      'DCA.Monster is an innovative Automated Market Maker (AMM) that utilizes ERC20 streams for precise and efficient on-chain Dollar Cost Averaging (DCA), powered by Cartesi Rollups, aimed at overcoming the traditional challenges associated with on-chain DCA solutions.',
    purposes: [
      'AMM'
    ],
    category: 'Optimistic Rollup',
    provider: 'Cartesi Rollups',
    links: {
      documentation: [
        'https://github.com/dcamonster/cartesi-defi-modular-components/blob/master/readme.md',
      ],
      repositories: ['https://github.com/dcamonster'],
      socialMedia: ['https://twitter.com/dca_monster'],
      websites: ['https://dca.monster'],
      apps: [],
      explorers: [],
    },
  },
})
