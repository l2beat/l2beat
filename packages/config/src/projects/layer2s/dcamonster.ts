import { UnixTime } from '@l2beat/shared-pure'
import { Layer2 } from '../layer2s'
import { upcomingL2 } from '../layer2s/templates/upcoming'

export const dcamonster: Layer2 = upcomingL2({
  id: 'dcamonster',
  createdAt: new UnixTime(1712577740), // 2024-04-08T12:02:20Z
  display: {
    name: 'DCA.Monster',
    slug: 'dcamonster',
    description:
      'DCA.Monster is an innovative AMM that utilizes ERC20 streams for precise and efficient onchain Dollar Cost Averaging (DCA), powered by Cartesi Rollups.',
    purposes: ['Exchange'],
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
