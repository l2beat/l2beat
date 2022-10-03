import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const across: Bridge = {
  type: 'bridge',
  id: ProjectId('across'),
  display: {
    name: 'Across',
    slug: 'across',
    links: {
      websites: ['https://across.to/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0xc186fA914353c44b2E33eBE05f21846F1048bEda', 
        sinceTimestamp: new UnixTime(1653124620),
        tokens: [
          'USDC',
          'WETH',
          'WBTC',
          'DAI',
          'BAL',
          'UMA',
          'BOBA',
          'USDT',
        ],
      },
    ],
  },
  technology: {
    category: 'Relayer Swap',
    destination: ['TODO', 'TODO', 'TODO'],
  },
  riskView: {
    validation: {
      value: 'Optimistic Bridge',
      description: 'TODO',
    },
  },
}
