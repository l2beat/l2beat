import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const dcamonster: Layer3 = upcomingL3({
  id: 'dcamonster',
  hostChain: 'Multiple',
  display: {
    name: 'DCA.Monster',
    slug: 'dcamonster',
    description:
      'DCA.Monster is an innovative AMM that utilizes ERC20 streams for precise and efficient on-chain Dollar Cost Averaging (DCA), powered by Cartesi Rollups.',
    purposes: ['AMM'],
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
