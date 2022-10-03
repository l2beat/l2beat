import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const cBridge: Bridge = {
  type: 'bridge',
  id: ProjectId('cbridge'),
  display: {
    name: 'Celer V2 cBridge',
    slug: 'cbridge',
    links: {
      websites: ['https://hop.exchange/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
        sinceTimestamp: new UnixTime(1638346811),
        tokens: [
          'USDC',
          'WETH',
          'USDT',
          'MASK',
          //'LYRA',
          'BUSD',
          //'THALES',
          //'TORN',
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint',
    destination: ['TODO', 'TODO', 'TODO'],
  },
  riskView: {
    validation: {
      value: 'Native Bridge',
      description: 'TODO',
    },
  },
}
