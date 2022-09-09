import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const polynetwork: Bridge = {
  id: ProjectId('polynetwork'),
  name: 'Polynetwork',
  slug: 'polynetwork',
  validation: 'LC Token Bridge',
  links: {
    websites: ['https://poly.network/'],
  },
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
  connections: [],
}
