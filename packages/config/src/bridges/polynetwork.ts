import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const polynetwork: Bridge = {
  type: 'bridge',
  id: ProjectId('polynetwork'),
  display: {
    name: 'Polynetwork',
    slug: 'polynetwork',
    links: {
      websites: ['https://poly.network/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
        sinceTimestamp: new UnixTime(1599099893),
        tokens: [
          'ETH',
          'USDT',
          'USDC',
          // 'COW',
          'WBTC',
          'DAI',
          'UNI',
          //'SHIBA',
          'renBTC',
          'FEI',
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint OR Swap',
    destination: ['TODO', 'TODO', 'TODO'],
  },
  riskView: {
    validation: {
      value: 'LC Token Bridge',
      description: 'TODO',
    },
  },
}
